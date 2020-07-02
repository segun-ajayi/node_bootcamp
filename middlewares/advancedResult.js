
const advancedResults = (model, populate) => (req, res, next) => {
    // copy req.query
    const reqStr = { ...req.query };

    // Fields to remove
    rFields = ['select', 'sort', 'page', 'limit'];

    // remove fileds from reqStr
    rFields.forEach((param) => delete reqStr[param]);

    // create query string and insert operators
    const queryStr = JSON.stringify(reqStr)
        .replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Execute query string
    let query = model.find(JSON.parse(queryStr));
    // implement select
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    // implement sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }
    // implementing pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;

    query2 = query.skip(startIndex).limit(limit);

    if (populate) {
        query2 = query2.populate(populate);
    }
    query2.then((data) => {
        const endIndex = page * limit;
        model.countDocuments().then(total => {
            const pagination = {};
            if (endIndex < total) {
                pagination.next = {
                    page: page + 1,
                    limit
                }
            }
            if (startIndex > 0) {
                pagination.prev = {
                    page: page - 1,
                    limit
                }
            }
            res.advancedResults = {
                success: true,
                count: data.length,
                pagination,
                data: data
            };
            next();
        });

    }).catch(err => {
        next(err);
    })
};

module.exports = advancedResults;