const express = require('express');
const { getMatches, getMatch, createMatch, updateMatch, deleteMatch } = require('../controller/matches.js')

const router = express.Router();

router.route('/')
    .get(getMatches)
    .post(createMatch);

router.route('/:id')
    .get(getMatch)
    .put(updateMatch)
    .delete(deleteMatch);

module.exports = router;