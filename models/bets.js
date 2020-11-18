const mongoose = require('mongoose')

const betScheme = new mongoose.Schema({
    result: {
        type: String,
        enum: [
            '1',
            '2',
            'x'
        ],
    },
    score: {
        team1: {
            type: Number,
            min: [0, 'Score cannot be below 0'],
            require: true
        },
        team2: {
            type: Number,
            min: [0, 'Score cannot be below 0'],
            require: true
        }
    },
    team1name: {
        type: String,
        required: true
    },
    team2name: {
        type: String,
        required: true
    },
    bet: {
        type: Number,
        min: [10, 'Bet cannot be below 0'],
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
    createdAt: {
        type: Date,
        default: Date.now
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

    }
});

betScheme.pre('save', function (next) {
    if (this.score.team1 > this.score.team2)
        this.result = '1';
    else if (this.score.team1 < this.score.team2)
        this.result = '2';
    else
        this.result = 'x';
    next();
})

module.exports = mongoose.model('Bet', betScheme);