
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const errorHandler = require('../utils/errorResponse');

exports.protect = (req, res, next) => {
    let accessToken;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        accessToken = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.authorization) {
    //     accessToken = req.cookies.authorization;
    // }

    // Check accessToken
    if (!accessToken) {
        return next({ message: 'You dont have access to use this resource', statusCode: 401 });
    }
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    User.findById(decoded.id).then(user => {
        req.user = user;
        next();
    }).catch(err => {
        console.log(err.message);
        return next({ message: err.message, statusCode: 500 })
    })
}

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next({ message: `User role ${req.user.role} is not allowed to use this resource`, statusCode: 403 });
        }
        next();
    }
}