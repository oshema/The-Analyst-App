const ErrorResponse = require('../utills/errorResponse')
const Bet = require('../models/bets')
const Match = require('../models/matches')

// @desc get all bets
// @route GET /winner/bet
// @access public

exports.getBets = async (req, res, next) => {
    try {
        const findBets = await Bet.find();

        //update bet status before showing all bets
        await Promise.all(findBets.map(async bet => {
            if (bet.status !== "canceled") {
                let matchTime = new Date(bet.matchTime).getTime();
                //get this time (utc + 2 hours)
                let now = Date.now() + 7200000;
                //if more then 110 minutes pass after the game change status to finish 
                if (now > matchTime + (6600000)) {
                    const betupdate = await Bet.findByIdAndUpdate(bet._id, { status: "finished" }, {
                        new: true,
                        runValidators: true
                    })
                    bet.status = betupdate.status;
                }
                else if (now > matchTime) {
                    const betupdate = await Bet.findByIdAndUpdate(bet._id, { status: "closed" }, {
                        new: true,
                        runValidators: true
                    })
                    bet.status = betupdate.status;
                }
                else if (now < matchTime) {
                    const betupdate = await Bet.findByIdAndUpdate(bet._id, { status: "open" }, {
                        new: true,
                        runValidators: true
                    })
                    bet.status = betupdate.status;
                }
            }
        }))

        res.status('200').json(
            {
                success: true,
                msg: 'Show all bets',
                count: findBets.length,
                data: findBets
            })
    }
    catch (err) {
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
        const playerData = { user: req.user.id, username: req.user.name, team1score: req.body.team1score, team2score: req.body.team2score };

        delete req.body.team1score;
        delete req.body.team2score;

        req.body.players = playerData

        //add matchId to req.body
        req.body.match = req.params.matchId

        let matchTime = new Date(req.body.matchTime)

        if (matchTime.getTime() < Date.now() + 7200000) {
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

        //check for bet status

        if (req.body.status !== "canceled") {
            let matchTime = ''
            //check if user update match time 
            if (req.body.matchTime) {
                matchTime = new Date(req.body.matchTime).getTime()
            }
            else {
                matchTime = new Date(betUpdate.matchTime).getTime()
            }

            if (req.body.createdAt > matchTime + (6600000)) {
                req.body.status = 'finished'
            }
            else if (req.body.createdAt > matchTime) {
                req.body.status = 'closed'
            }
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