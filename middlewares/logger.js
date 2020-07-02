const morgan = require('morgan');
const path = require('path')
const rfs = require('rotating-file-stream') // version 2.x

const accessLogStream = rfs.createStream(`${process.env.LOG_PATH}/access/access.log`, {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs/access')
}, { flags: 'a' });

morgan.token('host', function(req, res) {
    return req.hostname;
});
morgan.token('ip', function(req, res) {
    return req.ip;
});
morgan.token('time', function(req, res) {
    return Date.now();
});
const logger = morgan(':method :host :ip :status :res[content-length] - :response-time ms :time', {
    stream: accessLogStream,
    skip: function (req, res) { return res.statusCode > 400 }
});

module.exports = logger;