const db = require('mongoose');

const connectDB = async () => {
    const conn = await db.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        autoIndex: false
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
}

module.exports = connectDB;