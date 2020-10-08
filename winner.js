const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')

// import my routes
const users = require('./routes/users.js')

//add configuration to process.env
dotenv.config({ path: './config/config.env' })

const app = express();

//middelware logger in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//use routes
app.use('/winner', users)

// establish port
const PORT = process.env.PORT || 5000

//activate server
app.listen(PORT, console.log(`server running on ${process.env.NODE_ENV} at PORT ${PORT}`));
