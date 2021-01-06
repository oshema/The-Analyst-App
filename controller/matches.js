const ErrorResponse = require('../utills/errorResponse')
const Match = require('../models/matches')
const Bet = require('../models/bets')

// @desc get all matches
// @route GET /winner/match
// @access public

exports.getMatches = async (req, res, next) => {
    try {
        const findMatches = await Match.find().sort({ gameTime: -1 });
        res.status('200').json(
            {
                success: true,
                msg: 'Show all matches',
                count: findMatches.length,
                data: findMatches
            })
    }
    catch (err) {
        next(err)
    }
}

// @desc get specific match
// @route GET /winner/match/:id
// @access public

exports.getMatch = async (req, res, next) => {
    try {
        const findMatch = await Match.findById(req.params.id);
        if (!findMatch) {
            return next(new ErrorResponse(`couldn't find id: ${req.params.id}`, 404))
        }
        res.status(200).json({ success: true, msg: `Show match ${req.params.id}`, data: findMatch })
    }
    catch (err) {
        next(err)
    }
}

// @desc post match
// @route POST /winner/match
// @access public

exports.createMatch = async (req, res, next) => {
    try {
        const newMatch = await Match.create(req.body);
        res.status(201).json(
            {
                success: true,
                msg: `post new match`,
                data: newMatch
            })
    }
    catch (err) {
        next(err)
    }
}

// @desc update match
// @route PUT /winner/match/:id
// @access private

exports.updateMatch = async (req, res, next) => {
    try {
        if (!(Object.keys(req.body).includes('team1') && Object.keys(req.body).includes('team2') && Object.keys(req.body).includes('gameTime'))) {
            return next(new ErrorResponse(`teams names or game time is missing`, 400))
        }

        const matchUpdate = await Match.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if (!matchUpdate) {
            return next(new ErrorResponse(`couldn't find id: ${req.params.id}`, 404))
        }
        if (matchUpdate.bets.length > 0) {
            const bets = await Bet.updateMany({ _id: { $in: matchUpdate.bets } },
                { $set: { team1name: req.body.team1, team2name: req.body.team2, matchTime: req.body.gameTime } })
        }


        res.status('200').json({ success: true, msg: `Update match ${req.params.id}`, data: matchUpdate })
    }
    catch (err) {
        next(err)
    }
}

// @desc conclude match
// @route PUT /winner/match/finalscore/:id
// @access private

exports.concludeMatch = async (req, res, next) => {
    try {
        if (!(Object.keys(req.body).includes('team1Score') && Object.keys(req.body).includes('team2Score'))) {
            return next(new ErrorResponse(`teams scores is missing`, 400))
        }

        req.body.finished = true;

        const matchUpdate = await Match.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if (!matchUpdate) {
            return next(new ErrorResponse(`couldn't find id: ${req.params.id}`, 404))
        }
        if (matchUpdate.bets.length > 0) {
            const bets = await Bet.updateMany({ _id: { $in: matchUpdate.bets } },
                { $set: { team1endScore: req.body.team1Score, team2endScore: req.body.team2Score, isFinalScore: true } })
        }


        res.status('200').json({ success: true, msg: `set final score to match ${req.params.id}`, data: matchUpdate })
    }
    catch (err) {
        next(err)
    }
}


// @desc delete match
// @route DELETE /winner/match/:id
// @access private

exports.deleteMatch = async (req, res, next) => {
    try {
        const match = await Match.findById(req.params.id)

        if (!match) {
            return next(new ErrorResponse(`couldn't find id: ${req.params.id}`, 404))
        }
        const now = Date.now() + 1000 * 60 * 120
        if (match.bets.length > 0) {
            if (now > match.gameTime) {
                const bets = await Bet.updateMany({ _id: { $in: match.bets } },
                    { $set: { toDestroy: Date.now() + 2 * 60 * 60 * 1000 } })
            } else {
                const bets = await Bet.updateMany({ _id: { $in: match.bets } },
                    { $set: { status: 'canceled', toDestroy: Date.now() + 24 * 60 * 60 * 1000 } })
            }
        }
        //check for time again
        const matchRemoved = await match.remove();

        res.status('200').json({ success: true, msg: `deleted match ${req.params.id}`, data: matchRemoved })
    }
    catch (err) {
        next(err)
    }
}



