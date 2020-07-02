
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
// const geocoder = require('../utils/geocoder');

/**
 *
 * @desc Get all Courses
 * @route GET /api/v1/Courses
 * @route GET /api/v1/Bootcamp/:BootcampId/Courses
 * @access Public
 */
exports.index = (req, res, next) => {
    res.status(200).json(res.advancedResults);
}

/**
 *
 * @desc Get one Course
 * @route GET /api/v1/Courses/:id
 * @access Public
 */
exports.show = (req, res, next) => {
    const id = req.params.id;
    Course.findById(id).populate({
        path: 'bootcamp',
        select: 'name description'
    }).then(data => {
        if (!data) {
            return next({ name: 'CastError', value: req.params.id});
        }
        res.status(200).json({
            success: true,
            data: data,
        });
    }).catch(err => {
        next(err);
    });
}

/**
 *
 * @desc Create a Course
 * @route POST /api/v1/Courses/:bootcampId
 * @access Private
 */
exports.create = (req, res, next) => {
    Bootcamp.findById(req.params.bootcampId).then(data => {
        if (data) {
            req.body.bootcamp = req.params.bootcampId;
            Course.create(req.body).then((data) => {
                res.status(201).json({
                    success: true,
                    data: data
                });
            }).catch(err => {
                next(err);
            });
        } else {
            return next({ name: 'CastError', value: req.params.id});
        }
    })

}

/**
 *
 * @desc Get one Course
 * @route PUT /api/v1/Courses/:id
 * @access Private
 */
exports.update = (req, res, next) => {
    const id = req.params.id;
    Course.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    }).then(data => {
        if (!data) {
            return next({ name: 'CastError', value: req.params.id});
        }
        res.status(200).json({
           success: true,
           data: data
        });
    }).catch(err => {
        next(err);
    })
}

/**
 *
 * @desc Get one Course
 * @route DELETE /api/v1/Courses/:id
 * @access Private
 */
exports.destroy = (req, res, next) => {
    const id = req.params.id;
    Course.findById(id).then(data => {
        if (!data) {
            return next({ name: 'CastError', value: req.params.id});
        }
        data.remove().then(() => {
            res.status(200).json({
                success: true,
                data: data
            });
        });
    }).catch(err => {
        next(err);
    })
}
