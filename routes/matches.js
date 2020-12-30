const express = require('express');
const { getMatches, getMatch, createMatch, updateMatch, concludeMatch, deleteMatch } = require('../controller/matches.js')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router();

router.route('/')
    .get(getMatches)
    .post(protect, authorize('admin'), createMatch);

router.route('/:id')
    .get(getMatch)
    .put(protect, authorize('admin'), updateMatch)
    .delete(protect, authorize('admin'), deleteMatch);

router.put('/finalscore/:id', protect, authorize('admin'), concludeMatch);

module.exports = router;



