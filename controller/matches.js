const Match = require('../models/matches')

// @desc get all matches
// @route GET /winner/match
// @access public

exports.getMatches = async (req, res, next) => {
    const findMatches = await Match.find();
    res.status('200').json(
        {
            success: true,
            msg: 'Show all matches',
            count: findMatches.length,
            data: findMatches
        })
}

// @desc get specific match
// @route GET /winner/match/:id
// @access public

exports.getMatch = async (req, res, next) => {
    const findMatch = await Match.findById(req.params.id);
    if (!findMatch) {
        return res.status(400).json({ success: false, msg: "couldn't find match in DB" })
    }
    res.status(200).json({ success: true, msg: `Show match ${req.params.id}`, data: findMatch })
}

// @desc post match
// @route POST /winner/match
// @access public

exports.createMatch = async (req, res, next) => {
    const newMatch = await Match.create(req.body);
    res.status(201).json(
        {
            success: true,
            msg: `post new match`,
            data: newMatch
        })
}

// @desc update match
// @route PUT /winner/match/:id
// @access private

exports.updateMatch = async (req, res, next) => {
    const matchUpdate = await Match.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!matchUpdate) {
        return res.status(400).json({ success: false, msg: "couldn't find match" })
    }
    res.status('200').json({ success: true, msg: `Update match ${req.params.id}`, data: matchUpdate })
}

// @desc delete match
// @route DELETE /winner/match/:id
// @access private

exports.deleteMatch = async (req, res, next) => {
    const matchUpdate = await Match.findByIdAndDelete(req.params.id)

    if (!matchUpdate) {
        return res.status(400).json({ success: false, msg: "couldn't find match" })
    }
    res.status('200').json({ success: true, msg: `deleted match ${req.params.id}`, data: matchUpdate })
}



