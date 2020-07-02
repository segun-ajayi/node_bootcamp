
const uniqueValidator = (mo, field, val) => {
    return new Promise((resolve, reject) => {
        const model = require(`../models/${mo}`);
        model.find({ field: val }).then(data => {
            if (data.length < 1) {
                resolve({
                    success: true,
                    message: `${field} validated`
                });
            }
            reject({
                success: false,
                message: `${field} already exists`
            });
        });
    })
};

module.exports = uniqueValidator;