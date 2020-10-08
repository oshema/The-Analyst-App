// @desc get totalScore
// @route GET /winner/score
// @access public

exports.getScores = (req, res, next) => {
    res.status('200').json({ success: true, msg: 'Show all scores' })
}

// @desc get specific score
// @route GET /winner/score/:id
// @access public

exports.getScore = (req, res, next) => {
    res.status('200').json({ success: true, msg: `Show score ${req.params.id}` })
}

// @desc update score
// @route PUT /winner/score/:id
// @access private

exports.updateScore = (req, res, next) => {
    res.status('200').json({ success: true, msg: `Update score ${req.params.id}` })
}

// @desc delete score
// @route DELETE /winner/score/:id
// @access private

exports.deleteScore = (req, res, next) => {
    res.status('200').json({ success: true, msg: `Delete score ${req.params.id}` })
}



