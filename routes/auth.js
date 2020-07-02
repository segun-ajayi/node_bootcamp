const express = require('express');
const { login, register, reset, getUser } = require('../controllers/auth');
const { protect } = require('../middlewares/auth');
const router = express.Router();
const User = require('../models/User');
const advancedResults = require('../middlewares/advancedResult');
const uploadFile = require('../utils/fileUploader');

// //Include other resource routes
// const courseRouter = require('./course');

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/reset').post(reset);
router.route('/getUser').get(protect, getUser);

module.exports = router;