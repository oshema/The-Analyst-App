const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        ref: 'User',
        required: true
    },
    team1score: {
        type: Number,
        min: [0, 'Score cannot be below 0'],
        require: true
    },
    team2score: {
        type: Number,
        min: [0, 'Score cannot be below 0'],
        require: true
    },
    result: {
        type: String,
        enum: [
            '1',
            '2',
            'x'
        ],
    },
})

const betScheme = new mongoose.Schema({
    players: [playerSchema],
    bet: {
        type: Number,
        min: [10, 'Bet cannot be below 10'],
        required: true
    },
    status: {
        type: String,
        default: 'open',
        enum: [
            'open',
            'closed',
            'finished',
            'canceled',
        ],

    },
    team1name: {
        type: String,
        required: true
    },
    team2name: {
        type: String,
        required: true
    },
    match: {
        type: mongoose.Schema.ObjectId,
        ref: 'Match',
        required: true
    },
    matchTime: {
        type: Date,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

playerSchema.pre('save', function (next) {
    if (this.team1score > this.team2score)
        this.result = '1';
    else if (this.team1score < this.team2score)
        this.result = '2';
    else
        this.result = 'x';
    next();
})

module.exports = mongoose.model('Bet', betScheme);