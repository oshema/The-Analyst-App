const ErrorResponse = require('../utills/errorResponse')
const Match = require('../models/matches')

// @desc get all matches
// @route GET /winner/match
// @access public

exports.getMatches = async (req, res, next) => {
    try {
        const findMatches = await Match.find();
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
        const matchUpdate = await Match.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if (!matchUpdate) {
            return next(new ErrorResponse(`couldn't find id: ${req.params.id}`, 404))
        }
        res.status('200').json({ success: true, msg: `Update match ${req.params.id}`, data: matchUpdate })
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
        const matchDelete = await Match.findByIdAndDelete(req.params.id)

        if (!matchDelete) {
            return next(new ErrorResponse(`couldn't find id: ${req.params.id}`, 404))
        }
        res.status('200').json({ success: true, msg: `deleted match ${req.params.id}`, data: matchDelete })
    }
    catch (err) {
        next(err)
    }
}



