const ErrorResponse = require('../utills/errorResponse')
const Bet = require('../models/bets')
const Match = require('../models/matches')
const User = require('../models/user')


// @desc get all bets
// @route GET /winner/bet
// @access public

exports.getBets = async (req, res, next) => {
    try {
        const findBets = await Bet.find().sort({ matchTime: -1 });;

        //update bet status before showing all bets
        await Promise.all(findBets.map(async bet => {

            const winner = await concludeBet(bet);

            if (bet.toDestroy < Date.now()) {
                const betDestroyed = await Bet.findByIdAndDelete(bet._id);
                console.log("Bet Was Delete: ", betDestroyed)
            }
            if (bet.status !== "canceled") {
                let betupdate = ""
                let matchTime = new Date(bet.matchTime).getTime();
                //get this time (utc + 2 hours)
                let now = Date.now() + 7200000;
                //if more then 110 minutes pass after the game change status to finish 

                if (now > matchTime) {
                    if (bet.players.length < 2) {
                        betupdate = await Bet.findByIdAndUpdate(bet._id, { status: "canceled", toDestroy: Date.now() + 24 * 60 * 60 * 1000 }, {
                            new: true,
                            runValidators: true
                        })
                    }
                    else if (now > matchTime + (6600000)) {
                        if (bet.isPrizeCollected) {
                            betupdate = await Bet.findByIdAndUpdate(bet._id, { status: "finished", toDestroy: Date.now() + 24 * 60 * 60 * 1000 }, {
                                new: true,
                                runValidators: true
                            })
                        } else {
                            betupdate = await Bet.findByIdAndUpdate(bet._id, { status: "finished" }, {
                                new: true,
                                runValidators: true
                            })
                        }
                    }
                    else {
                        betupdate = await Bet.findByIdAndUpdate(bet._id, { status: "closed" }, {
                            new: true,
                            runValidators: true
                        })
                    }

                } else {
                    betupdate = await Bet.findByIdAndUpdate(bet._id, { status: "open" }, {
                        new: true,
                        runValidators: true
                    })
                }

                bet.status = betupdate.status;
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

        //add bet ref id to match
        const match = await Match.findById(req.body.match)
        match.bets.push(newBet._id)
        await match.save(function (err) {
            if (err) {
                newBet.status = 'canceled'
                return next(new ErrorResponse(`match error`, 500))
            }
        })



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

        let bet = await Bet.findById(req.params.id)

        if (!bet) {
            return next(new ErrorResponse(`couldn't find id: ${req.params.id}`, 404))
        }
        if (bet.status !== 'open') {
            return next(new ErrorResponse(`This bet is closed`, 400))
        }

        let matchTime = new Date(bet.matchTime).getTime();
        //get this time (utc + 2 hours)
        let now = Date.now() + 7200000;

        if (now > matchTime)
            return next(new ErrorResponse(`Cannot edit, match already started`, 400))

        if (bet.players.length > 1)
            return next(new ErrorResponse(`Multiple guesses, Cannot edit bet - only guess`, 400))

        bet.players[0].team1score = req.body.team1score;
        bet.players[0].team2score = req.body.team2score;
        bet.bet = req.body.bet;

        await bet.save(function (err, updateData) {
            if (err) {
                next(err)
            }
            res.status('200')
                .json({ success: true, msg: `Bet has been edited`, data: updateData })
        })
    }
    catch (err) {
        next(err)
    }
}

// @desc update guess
// @route PUT /winner/bet/:id/:guessid
// @access private

exports.updateGuess = async (req, res, next) => {
    try {

        let bet = await Bet.findById(req.params.id)

        if (!bet) {
            return next(new ErrorResponse(`couldn't find id: ${req.params.id}`, 404))
        }
        if (bet.status !== 'open') {
            return next(new ErrorResponse(`This bet is closed`, 400))
        }

        //check for duplicate guess in the same doc (score has to be unique for each bet)
        let checkDup = await Bet.find({ _id: req.params.id }, { players: { $elemMatch: { team1score: req.body.team1score, team2score: req.body.team2score } } })
        if (checkDup[0].players.length > 0) {
            console.log
            return next(new ErrorResponse(`This guess already exist, please choose a unique score`, 400))
        }

        let matchTime = new Date(bet.matchTime).getTime();
        //get this time (utc + 2 hours)
        let now = Date.now() + 7200000;

        if (now > matchTime)
            return next(new ErrorResponse(`Cannot edit, match already started`, 400))


        await Bet.updateMany({ _id: req.params.id, "players._id": req.params.guessid },
            { $set: { "players.$.team1score": req.body.team1score, "players.$.team2score": req.body.team2score } }, (err, data) => {
                if (err)
                    next(err)
                else {
                    res.status('200').json({ success: true, msg: `Guess was edited`, data: { team1score: req.body.team1score, team2score: req.body.team2score } })
                }
            })

    }
    catch (err) {
        next(err)
    }
}

// @desc join bet
// @route PUT /winner/bet/join/:id
// @access private

exports.joinBet = async (req, res, next) => {
    try {
        let mainBet = await Bet.findById(req.params.id)
        if (!mainBet) {
            return next(new ErrorResponse(`couldn't find id: ${req.params.id}`, 404))
        }
        if (mainBet.status !== 'open') {
            return next(new ErrorResponse(`This bet is closed`, 404))
        }

        if (!req.body.team1score || !req.body.team2score) {
            return next(new ErrorResponse(`you need to enter valid score`, 400))
        }

        let matchTime = new Date(mainBet.matchTime).getTime();
        //get this time (utc + 2 hours)
        let now = Date.now() + 7200000;

        if (now > matchTime)
            return next(new ErrorResponse(`Cannot join, match already started`, 404))

        const playerData = {
            user: req.user.id,
            username: req.user.name,
            team1score: req.body.team1score,
            team2score: req.body.team2score
        }

        //check if player or guess existing already
        let isPlayer = false;
        let isGuess = false;
        mainBet.players.forEach(async bet => {
            if (bet.user == playerData.user) {
                isPlayer = true;
            }
            if (bet.team1score == playerData.team1score && bet.team2score == playerData.team2score) {
                isGuess = true;
            }
        });

        if (isPlayer) {
            return next(new ErrorResponse(`You already have a guess in this bet`, 404))
        }
        if (isGuess) {
            return next(new ErrorResponse(`This score guess is already taken`, 404))
        }

        //push new bet
        mainBet.players.push(playerData);
        await mainBet.save(function (err, playersUpdated) {
            if (err) {
                next(err)
            }
            res.status('200')
                .json({ success: true, msg: `new Bet joined to main bet: ${req.params.id}`, data: playersUpdated.players[playersUpdated.players.length - 1] })
        })
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
        const bet = await Bet.findById(req.params.id);
        if (!bet) {
            return next(new ErrorResponse(`couldn't find id: ${req.params.id}`, 404))
        }

        const matchId = bet.match

        let matchTime = new Date(bet.matchTime).getTime();
        //get this time (utc + 2 hours)
        let now = Date.now() + 7200000;

        if (now > matchTime)
            return next(new ErrorResponse(`Cannot delete, match already started`, 404))

        const betDelete = await bet.deleteOne()
        if (!betDelete) {
            return next(new ErrorResponse(`cannot remove bet`, 404))
        }

        //remove bet ref ID in match
        await Match.update({ _id: matchId }, { $pull: { bets: bet._id } },
            function (err, data) {

                if (err)
                    return next(err);
            })


        res.status('200').json({ success: true, msg: `deleted bet ${req.params.id}`, data: betDelete })
    }
    catch (err) {
        next(err)
    }
}

// @desc delete guess
// @route DELETE /winner/bet/:id/:guessid
// @access private 

exports.deleteGuess = async (req, res, next) => {
    try {
        const bet = await Bet.findById(req.params.id);
        if (!bet) {
            return next(new ErrorResponse(`couldn't find id: ${req.params.id}`, 404))
        }

        let matchTime = new Date(bet.matchTime).getTime();
        //get this time (utc + 2 hours)
        let now = Date.now() + 7200000;

        if (now > matchTime)
            return next(new ErrorResponse(`Cannot delete, match already started`, 404))

        await Bet.update({ _id: req.params.id }, { $pull: { players: { _id: req.params.guessid } } },
            function (err, data) {

                if (err)
                    return next(err);
                else {
                    res.status('200').json({ success: true, msg: `deleted guess ${req.params.guessid}`, data: data })
                }
            });

    }
    catch (err) {
        next(err)
    }
}


const concludeBet = async (bet) => {
    if (bet.isFinalScore && bet.status == 'finished') {
        if (!bet.isPrizeCollected) {
            if (bet.players.length > 1) {
                let loserList = [];
                let betPrize = 0 - bet.bet;
                bet.players.forEach(async guess => {
                    betPrize = betPrize + bet.bet;
                    if (guess.team1score == bet.team1endScore && guess.team2score == bet.team2endScore) {
                        bet.winner = guess.user
                    } else {
                        loserList.push(guess.user)
                    }
                })
                if (bet.winner) {
                    const winner = await User.findOneAndUpdate({ _id: bet.winner },
                        { $inc: { wins: 1, points: betPrize, total: 1 } },
                        { new: true, runValidators: true });
                    const losers = await User.updateMany({ _id: { $in: loserList } },
                        { $inc: { loses: 1, points: -bet.bet, total: 1 } },
                        { new: true, runValidators: true });
                } else {
                    const drews = await User.updateMany({ _id: { $in: loserList } },
                        { $inc: { drew: 1, total: 1 } },
                        { new: true, runValidators: true });
                    await User.find
                }
                bet.isPrizeCollected = true
                const savedBet = await bet.save()
            }
        }
    }
    return bet
}
