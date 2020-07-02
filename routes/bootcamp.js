const express = require('express');
const { index,
        create,
        destroy,
        show,
        update,
        getWithinRadius,
        uploadPhoto } = require('../controllers/bootcamps');
const { protect, authorize } = require('../middlewares/auth');
const router = express.Router();
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middlewares/advancedResult');
const uploadFile = require('../utils/fileUploader');

// //Include other resource routes
// const courseRouter = require('./course');

router.route('/').get(advancedResults(Bootcamp, 'courses'), index).post(protect, authorize('publisher', 'admin'), create);
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), uploadFile(Bootcamp), uploadPhoto);
router.route('/:zipcode/:distance/:unit').get(getWithinRadius);
router.route('/:id').get(show)
        .put(protect, authorize('publisher', 'admin'), update)
            .delete(protect, authorize('publisher', 'admin'), destroy);

module.exports = router;