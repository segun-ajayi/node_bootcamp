const logger = require('morgan');
const rfs = require("rotating-file-stream");
const errorResponse = require('../utils/errorResponse');
// create a rotating write stream
const accessLogStream = rfs.createStream(`${process.env.LOG_PATH}/errors/error.log`);

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Check for invalid id error
    if (err.name === 'CastError' || err === 'CastError') {
        const message = `Not Found: Bootcamp with id: ${err.value} does not exists`;
        error = new errorResponse(message, 400);
    } else if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new errorResponse(message, 404);
    } else if (err.code === 11000) {
        const message = `Bootcamp name: ${err.keyValue.name} already exists, please enter a different name`;
        error = new errorResponse(message, 400);
    } else {
        error = new errorResponse(error.message, error.statusCode);
    }
    logger('combined', {stream: accessLogStream});
    // render the error page
    res.status(error.statusCode || 500).json({
        success: false,
        data: error.message
    });
}

module.exports = errorHandler;