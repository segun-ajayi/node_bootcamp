const path = require('path');

const fileUploader = (model) => (req, res, next) => {
    const id = req.params.id;
    if (!req.files) {
        return next({ message: 'Please pick a file to upload', statusCode:400 });
    }
    const file = req.files.file;
    // Check if file is an image
    if (!file.mimetype.startsWith('image')) {
        return next({ message: 'Please upload an image file', statusCode:400 });
    }
    // check if file is less than max upload limit
    if (file.size > process.env.MAX_UPLOAD_SIZE) {
        return next({ message: `Image size should be less than ${process.env.MAX_UPLOAD_SIZE / 1000} KB`, statusCode:400 });
    }
    // File name
    file.name = `photo_${id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, function (err) {
        if (err) {
            return next({ message: 'Something went wrong, please try again.', statusCode: 500 });
        }
    });
    model.findByIdAndUpdate(id, {
        photo: file.name
    }, {
        new: true
    }).then(data => {
        if (!data) {
            return next({ name: 'CastError', value: req.params.id});
        }
        res.uploadFile = {
            success: true,
            data: 'File uploaded successfully!'
        };
        next();
    }).catch(err => {
        next(err);
    })
};

module.exports = fileUploader;

