
require('dotenv').config();

// Load Models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

const db = require('mongoose');
const fs = require('fs');

db.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))

// Import data
const importData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('All Data deleted...')
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log('New Data imported');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

// Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Data destroyed');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if(process.argv[2] === '-d') {
    deleteData();
} else {
    console.log('Enter -i for import and -d for dumping');
    process.exit();
}