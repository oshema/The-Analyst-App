const express = require('express');
const { getBets, getBet, createBet, updateBet, deleteBet } = require('../controller/bets.js')

const router = express.Router();

router.route('/')
    .get(getBets)
    .post(createBet);

router.route('/:id')
    .get(getBet)
    .put(updateBet)
    .delete(deleteBet);

module.exports = router;