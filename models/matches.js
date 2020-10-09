const mongoose = require('mongoose')

const matchScheme = new mongoose.Schema({
    team1: {
        type: String,
        required: true
    },
    team2: {
        type: String,
        required: true
    },
    gameType: {
        type: String,
        enum: [
            'soccer',
            'basketball',
            'tennis'
        ],
        default: 'soccer'
    },
    team1Score: {
        type: Number,
        default: '0',
        min: [0, 'cannot be below 0']
    },
    team2Score: {
        type: Number,
        default: '0',
        min: [0, 'cannot be below 0']
    },
    finished: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('match', matchScheme);