const crypto = require('crypto')
const ErrorResponse = require('../utills/errorResponse')
const User = require('../models/user')
const cookieParser = require('cookie-parser')
const sendEmail = require('../utills/sendEmail')

//@desc Register user
//route POST /winner/auth/register
//access public

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.create({
            name,
            email,
            password
        });

        //send response
        sendTokenResponse(user, 200, res)
    }
    catch (err) {
        next(err)
    }
}

//@desc login user
//route POST /winner/auth/login
//access public

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //validate email & password
        if (!email || !password) {
            next(new ErrorResponse(`please provide email and password`, 404))
        }
        user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorResponse(`invalid credentials`, 401))
        }

        //check if password matches
        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            return next(new ErrorResponse(`invalid credentials`, 401))
        }

        //send response
        sendTokenResponse(user, 200, res)
    }
    catch (err) {
        next(err)
    }
}

//@desc get current user
//route GET /winner/auth/me
//access private

exports.me = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)

        res.status(200).json({ succes: true, data: user })
    }
    catch (err) {
        next(err)
    }
}

//@desc logout user / clear cookie
//route GET /winner/auth/logout
//access private

exports.logout = async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        })

        res.status(200).json({ succes: true, data: {} })
    }
    catch (err) {
        next(err)
    }
}

//@desc update user name and email
//route PUT /winner/auth/updatedetails
//access private

exports.updateDetails = async (req, res, next) => {
    try {

        const updateDetails = {
            name: req.body.name,
            email: req.body.email
        }

        const user = await User.findByIdAndUpdate(req.user.id, updateDetails, {
            new: true,
            runValidators: true
        })

        res.status(200).json({ succes: true, data: user })
    }
    catch (err) {
        next(err)
    }
}

//@desc update password
//route PUT /winner/auth/updatepassword
//access private

exports.updatePassword = async (req, res, next) => {
    try {

        const user = await User.findById(req.user.id).select('+password')

        if (!(await user.matchPassword(req.body.currentPassword))) {
            return next(new ErrorResponse('password is incorrect'), 401)
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res)
    }
    catch (err) {
        next(err)
    }
}

//@desc forget password
//route POST /winner/auth/forgotpassword
//access public

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            next(new ErrorResponse('There is not user with that email', 404))
        }

        //get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false })

        //create reset url
        const resetUrl = `${req.protocol}://${req.get('host')}/winner/auth/resetpassword/${resetToken}`

        const message = `click on this link to reset your password: \n ${resetUrl}`

        try {
            sendEmail({ email: user.email, subject: 'reset password', message })

            res.status(200).json({ succes: true, data: 'email sent' })

        }
        catch (err) {
            console.log(err)
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false })

            return next(new ErrorResponse('Email could not be sent', 500))
        }
    }
    catch (err) {
        next(err)
    }
}

//@desc reset password
//route PUT /winner/auth/resetpassword/:resettoken
//access public

exports.resetPassword = async (req, res, next) => {
    try {

        resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

        const user = await User.findOne({ resetPasswordToken, resetPasswordExpier: { $gt: Date.now() } })

        if (!user) {
            return next(new ErrorResponse('Invalid token', 400))
        }

        //set new password
        user.password = req.body.password
        user.resetPasswordToken = undefined;
        user.resetPasswordExpier = undefined;
        await user.save();

        sendTokenResponse(user, 200, res)

    }
    catch (err) {
        next(err);
    }
}

const sendTokenResponse = (user, statusCode, res) => {

    //Create Token
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(statusCode).cookie('token', token, options).json({ success: true, token })

}









