
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder');

/**
 *
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.index = (req, res, next) => {
    res.status(200).json(res.advancedResults);
}

/**
 *
 * @desc Get one bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
exports.show = (req, res, next) => {
    const id = req.params.id;
    Bootcamp.findById(id).populate('courses').then(data => {
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
 * @desc Create a bootcamp
 * @route POST /api/v1/bootcamps/
 * @access Private
 */
exports.create = (req, res, next) => {
    Bootcamp.create(req.body).then((data) => {
       res.status(201).json({
          success: true,
          data: data
       });
    }).catch(err => {
        next(err);
    });
}

/**
 *
 * @desc Get one bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
exports.update = (req, res, next) => {
    const id = req.params.id;
    Bootcamp.findByIdAndUpdate(id, req.body, {
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
 * @desc Upload photo for bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
exports.uploadPhoto = (req, res, next) => {
    res.status(200).json(res.uploadFile);
}

/**
 *
 * @desc Get one bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
exports.destroy = (req, res, next) => {
    const id = req.params.id;
    Bootcamp.findById(id).then(data => {
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

/**
 *
 * @desc Get bootcamp with a radius
 * @route DELETE /api/v1/bootcamps/radius/:zipcode/:distance/:unit
 * @access Private
 */
exports.getWithinRadius = (req, res, next) => {
    const { zipcode, distance, unit } = req.params;
    const radius = unit === 'km' ? distance / 6378 : distance / 3963;
    geocoder.geocode(zipcode).then((data) => {
        const long = data[0].longitude;
        const lat = data[0].latitude;
    });

    Bootcamp.find({location: { $geoWithin: { $centerSphere: [ [ long, lat ], radius ] } }}).then(data => {
        if (!data) {
            return next({ name: 'CastError', value: req.params.id});
        }
        res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });
    }).catch(err => {
        next(err);
    })
}