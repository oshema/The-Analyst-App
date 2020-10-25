const express = require('express')
const { register, login, logout, me, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controller/auth')

const { protect } = require('../middleware/auth')

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/me', protect, me);


module.exports = router