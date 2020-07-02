const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream'); // version 2.x

// create a rotating write stream
const errorLogStream = rfs.createStream('error.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs/error')
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
// morgan.token('message', function(req, res) {
//     console.log('segun', res.body);
//     return res.message;
// });
const errorLogger = morgan(':method :host :ip :status :res[content-length] - :response-time ms :time', {
    stream: errorLogStream,
    skip: function (req, res) { return res.statusCode < 400 }
});

module.exports = errorLogger;