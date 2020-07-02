const db = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');

const UserSchema = new db.Schema({
    lastname: {
        type: String,
        required: [true, 'Please enter a surname'],
        trim: true
    },
    firstname: {
        type: String,
        required: [true, 'Please enter a first name'],
        trim: true
    },
    middlename: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'publisher']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Methods
// Get signed token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Match password
UserSchema.methods.matchPassword = function(enteredPassword) {
  bcrypt.compare(enteredPassword, this.password).then(value => {
    return value;
  });
};

// Unique validator
UserSchema.plugin(uniqueValidator)

//Virtuals
UserSchema.virtual('fullname').get(function () {
    return `${this.lastname} ${this.firstname} ${this.middlename}`;
});

// Middlewares
// Hash password before saving
    UserSchema.pre('save', async function (next) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    });



module.exports = db.model('User', UserSchema);