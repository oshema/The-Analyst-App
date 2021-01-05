const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

// import my routes
const bets = require('./routes/bets.js')
const matches = require('./routes/matches.js')
const auth = require('./routes/auth.js')
const users = require('./routes/users.js')

//add configuration to process.env
dotenv.config({ path: './config/config.env' })

//connect to dataBase
connectDB();

const app = express();

//body parser
app.use(express.json());

//sanitize data
app.use(mongoSanitize());

//helmet protection
app.use(helmet());

//activate cors
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true
    }
));

//middelware logger in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//use cookie-parser
app.use(cookieParser());

//use routes
app.use('/winner/match', matches);
app.use('/winner/bet', bets);
app.use('/winner/auth', auth);
app.use('/winner/users', users);

//Error Handler middleware
app.use(errorHandler);

//serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static('winner-front/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'winner-front', "build", "index.html"));
    })
}



// establish port
const PORT = process.env.PORT || 5000

//activate server
app.listen(PORT, console.log(`server running on ${process.env.NODE_ENV} at PORT ${PORT}`.yellow.bold));
