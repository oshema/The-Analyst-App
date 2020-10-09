const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')

// import my routes
const bets = require('./routes/bets.js')
const matches = require('./routes/matches.js')

//add configuration to process.env
dotenv.config({ path: './config/config.env' })

//connect to dataBase
connectDB();

const app = express();

//body parser
app.use(express.json());

//middelware logger in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//use routes
app.use('/winner/match', matches);
app.use('/winner/bet', bets);

// establish port
const PORT = process.env.PORT || 5000

//activate server
app.listen(PORT, console.log(`server running on ${process.env.NODE_ENV} at PORT ${PORT}`.yellow.bold));
