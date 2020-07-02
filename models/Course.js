const db = require('mongoose');
// const slugify = require('slugify');
// const geocoder = require('../utils/geocoder');
const CourseSchema = new db.Schema({
   title: {
       type: String,
       required: [true, 'Please add a title'],
       trim: true,
       maxlength: [50, 'Name can not be more than 50 characters']
   },
   slug: String,
   description: {
       type: String,
       required: [true, 'Please add a description'],
       trim: true,
       maxlength: [500, 'Description can not be more than 50 characters']
   },
   weeks: {
       type: String,
       required: [true, 'Please add number of weeks'],
   },
   tuition: {
       type: Number,
       required: [true, 'please add tuition cost'],
   },
   minimumSkill: {
       type: String,
       required: [true, 'Please add minimum skill level'],
       enum: ['beginner', 'intermediate', 'advanced']
   },
   scholarshipAvailable: {
      type: Boolean,
      default: false
   },
   location: {
      type: {
          type: String,
          enum: ['point'],
      },
      coordinates: {
          type: [Number],
          index: '2dsphere'
      },
      place_id: String,
      formattedAddress: String,
      neighborhood: String,
      street: String,
      city: String,
      lga: String,
      state: String,
      zipcode: String,
      country: String,
   },
   careers : {
      type: [String],
      required: true,
      enum: [
          'Web Development',
          'Mobile Development',
          'UI/UX',
          'Data Science',
          'Business',
          'other',
      ],
   },
   averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating can not be more than 10'],
   },
   averageCost: Number,
   photo: {
      type: String,
      default: 'no-pix.jpg'
   },
   createdAt: {
      type: Date,
      default: Date.now
   },
   bootcamp: {
       type: db.Schema.ObjectId,
       ref: 'Bootcamp',
       required: true
   }
});

// Statics
// get average cost
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]).then(data => {
       this.model('Bootcamp').findByIdAndUpdate(data[0]._id, {
           averageCost: Math.ceil(data[0].averageCost)
       }, { new: true }).then(bootcamp => {
        }).catch(err => {
            console.log('err');
       });
    });
};

// Middlewares
// Call getAverageCost after save
CourseSchema.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before removing
CourseSchema.pre('remove', function() {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = db.model('Course', CourseSchema);