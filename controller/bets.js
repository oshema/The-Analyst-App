const ErrorResponse = require('../utills/errorResponse')
const Bet = require('../models/bets')
const Match = require('../models/matches')

// @desc get all bets
// @route GET /winner/bet
// @access public

exports.getBets = async (req, res, next) => {
    try {
        console.log(Bet)
        const findBets = await Bet.find();
        res.status('200').json(
            {
                success: true,
                msg: 'Show all bets',
                count: findBets.length,
                data: findBets
            })
    }
    catch (err) {
        console.log()
        next(err)
    }
}

// @desc get specific bet
// @route GET /winner/bet/:id
// @access public

exports.getBet = async (req, res, next) => {
    try {
        const findBet = await Bet.findById(req.params.id);
        if (!findBet) {
            return next(new ErrorResponse(`couldn't find id: ${req.params.id}`, 404))
        }
        res.status(200).json({ success: true, msg: `Show Bet ${req.params.id}`, data: findBet })
    }
    catch (err) {
        next(err)
    }
}

// @desc create bet
// @route POST /winner/bet/:matchId
// @access public

exports.createBet = async (req, res, next) => {
    try {
        //add user to req.body
        req.body.user = req.user.id

        //add user name to req.body
        req.body.username = req.user.name

        //add matchId to req.body
        req.body.match = req.params.matchId

        let matchTime = new Date(req.body.matchTime)

        if (matchTime.getTime() < Date.now()) {
            return next(new ErrorResponse(`Match starting time is in the past`, 400))
        }

        //create bet
        const newBet = await Bet.create(req.body);

        res.status(201).json(
            {
                success: true,
                msg: `post new bet`,
                data: newBet
            })
    }
    catch (err) {
        next(err)
    }
}

// @desc update bet
// @route PUT /winner/bet/:id
// @access private

exports.updateBet = async (req, res, next) => {
    try {
        //update validation

        //check for result entering
        if (Object.keys(req.body).includes('result'))
            return next(new ErrorResponse(`you connot enter result, only score`, 400))

        //check for bet or score entering
        if (!Object.keys(req.body).includes('bet') && !Object.keys(req.body).includes('score') && !Object.keys(req.body).includes('status'))
            return next(new ErrorResponse(`you didnt update`, 400))

        //check for teams score entering
        if (Object.keys(req.body).includes('score')) {
            if (!Object.keys(req.body.score).includes('team1') || !Object.keys(req.body.score).includes('team2'))
                return next(new ErrorResponse(`you need to enter team 1 and 2`, 400))
            else {
                // update result according to score update
                if (req.body.score.team1 > req.body.score.team2)
                    req.body.result = '1';
                else if (req.body.score.team1 < req.body.score.team2)
                    req.body.result = '2';
                else
                    req.body.result = 'x';
            }
        }
        req.body.createdAt = Date.now();

        let betUpdate = await Bet.findById(req.params.id)

        if (!betUpdate) {
            return next(new ErrorResponse(`couldn't find id: ${req.params.id}`, 404))
        }

        betUpdate = await Bet.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status('200').json({ success: true, msg: `Update Bet ${req.params.id}`, data: betUpdate })
    }
    catch (err) {
        next(err)
    }
}

// @desc delete Bet
// @route DELETE /winner/bet/:id
// @access private

exports.deleteBet = async (req, res, next) => {
    try {
        const betDelete = await Bet.findByIdAndDelete(req.params.id)

        if (!betDelete) {
            return next(new ErrorResponse(`couldn't find id: ${req.params.id}`, 404))
        }
        res.status('200').json({ success: true, msg: `deleted bet ${req.params.id}`, data: betDelete })
    }
    catch (err) {
        next(err)
    }
}