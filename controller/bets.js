// @desc get all bets
// @route GET /winner/bet
// @access public

exports.getBets = (req, res, next) => {
    res.status('200').json({ success: true, msg: 'Show all bets' })
}

// @desc get specific bet
// @route GET /winner/bet/:id
// @access public

exports.getBet = (req, res, next) => {
    res.status('200').json({ success: true, msg: `Show bet ${req.params.id}` })
}

// @desc create bet
// @route POST /winner/bet
// @access public

exports.createBet = (req, res, next) => {
    res.status('200').json({ success: true, msg: `Create new bet` })
}

// @desc update bet
// @route PUT /winner/bet/:id
// @access private

exports.updateBet = (req, res, next) => {
    res.status('200').json({ success: true, msg: `Update bet ${req.params.id}` })
}

// @desc delete Bet
// @route DELETE /winner/bet/:id
// @access private

exports.deleteBet = (req, res, next) => {
    res.status('200').json({ success: true, msg: `Delete bet ${req.params.id}` })
}