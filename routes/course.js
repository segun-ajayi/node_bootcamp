const express = require('express');
const { index, create, destroy, show, update } = require('../controllers/courses');
const { protect, authorize } = require('../middlewares/auth');
const router = express.Router();

const Courses = require('../models/Course');
const advancedResults = require('../middlewares/advancedResult');

router.route('/').get(advancedResults(Courses, 'bootcamp'), index);
router.route('/bootcamp/:bootcampId').get(advancedResults(Courses, 'bootcamp'), index).post(protect, authorize('publisher', 'admin'), create);
router.route('/:id').get(show).put(protect, authorize('publisher', 'admin'), update).delete(protect, authorize('publisher', 'admin'), destroy);

module.exports = router;