const db = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');
const courses = require('./Course');
const BootcampSchema = new db.Schema({
   name: {
       type: String,
       required: [true, 'Please add a name'],
       unique: true,
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
   website: {
       type: String,
       match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
           'Please use a valid URL with http:// or https://'],
   },
   phone: {
       type: String,
       minlength: [13, 'please enter phone number in this format: 2348030000000'],
       maxlength: [14, 'please enter phone number in this format: 2348030000000'],
   },
   email: {
       type: String,
       match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
               'Please add a valid email'
       ]
   },
   address: {
      type: String,
      required: [true, 'Please add an address']
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
   housing: {
       type: Boolean,
       default: false
    },
    jobAssistance: {
       type: Boolean,
       default: false
    },
    jobGuarantee: {
       type: Boolean,
       default: false
    },
    acceptGi: {
       type: Boolean,
       default: false
    },
    createdAt: {
       type: Date,
       default: Date.now
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//Cascade delete courses when bootcamp gets deleted
BootcampSchema.pre('remove', async function () {
    await this.model('Course').deleteMany({
        bootcamp: this._id
    });
})

//Virtuals
BootcampSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
    // options: { sort: { date: -1 }, limit: 10 } // optional - could add with populate
});

// Middlewares
BootcampSchema.pre('save', async function(next) {
    this.slug = slugify(this.name, { lower: true });
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        place_id: loc[0].googlePlaceId,
        formattedAddress: loc[0].formattedAddress,
        neighborhood: loc[0].extra.neighborhood,
        street: loc[0].streetName,
        city: loc[0].city,
        lga: loc[0].administrativeLevels.level2long,
        state: loc[0].administrativeLevels.level1long,
        zipcode: loc[0].zipcode,
        country: loc[0].country
    };
    // this.address = loc[0].formattedAddress;
    next();
})

module.exports = db.model('Bootcamp', BootcampSchema);