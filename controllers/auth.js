
const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 *
 * @desc Register a User
 * @route POST /api/v1/auth/register
 * @access Public
 */
exports.register = (req, res, next) => {
    const { firstname,
            middlename,
            lastname,
            password,
            role,
            email } = req.body;
    User.create({
        firstname,
        middlename,
        lastname,
        password,
        role,
        email
    }).then((user) => {
        // Create token
        sendTokenResponse(user, 200, res);
    }).catch(err => {
        next(err);
    });
}

/**
 *
 * @desc login a user
 * @route POST /api/v1/auth/login
 * @access Public
 */
exports.login = (req, res, next) => {
    const { email, password, remember } = req.body;

    // Validate email and passord
    if (!email || !password) {
        return next({ message: 'Email or password fields can not be empty', statusCode: 400 });
    }

    // Find user
    User.findOne({ email }).select('+password').then((user) => {
        if (!user) {
            return next({message: `Invalid credentials`, statusCode: 401});
        }
        // Check if password matches
        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) {
                return next({message: `Invalid credentials`, statusCode: 401});
            }
            // Create token
            sendTokenResponse(user, 200, res);
        });
    });
}

/**
 *
 * @desc Reset user password
 * @route POST /api/v1/auth/reset
 * @access Public
 */
exports.reset = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: 'reset password'
    });
}

exports.getUser = (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        data: user
    });
}

const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const accessToken = user.getSignedJwtToken();
    const option = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN * 24 *60 * 60 * 1000)),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') {
        option.secure = true;
    }
    res.status(statusCode)
        .cookie('accessToken', accessToken, option)
        .json({
            success: true,
            user,
            accessToken
        });
}


