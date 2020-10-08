const express = require('express');
const { getScores, getScore, updateScore, deleteScore } = require('../controller/users.js')
const { getBets, getBet, createBet, updateBet, deleteBet } = require('../controller/bets.js')

const router = express.Router();

router.route('/score')
    .get(getScores);

router.route('/score/:id')
    .get(getScore)
    .put(updateScore)
    .delete(deleteScore);

router.route('/bet')
    .get(getBets)
    .post(createBet);

router.route('/bet/:id')
    .get(getBet)
    .put(updateBet)
    .delete(deleteBet);





module.exports = router;