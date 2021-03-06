const mongoose = require('mongoose')

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    // mongoose.set('debug', true);
    console.log(`mongoDB is connected: ${conn.connection.host}`.blue.bold);
}

module.exports = connectDB;

