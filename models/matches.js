const mongoose = require('mongoose')

const matchScheme = new mongoose.Schema({

    bets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bet',
        require: true
    }],
    team1: {
        type: String,
        required: (true, 'please had team 1')
    },
    team2: {
        type: String,
        required: (true, 'please add team 2')
    },
    team1Score: {
        type: Number,
        default: 0,
        min: [0, 'cannot be below 0']
    },
    team2Score: {
        type: Number,
        default: 0,
        min: [0, 'cannot be below 0']
    },
    gameTime: {
        type: Date,
        required: (true, 'please add gameTime')
    },
    finished: {
        type: Boolean,
        default: false
    }
})



module.exports = mongoose.model('Match', matchScheme);