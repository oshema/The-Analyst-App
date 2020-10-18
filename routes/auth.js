const express = require('express')
const { register, login, me } = require('../controller/auth')

const { protect } = require('../middleware/auth')

const router = express.Router();

router.post('/register', register);
router.post('/login', login)
router.get('/me', protect, me)

module.exports = router