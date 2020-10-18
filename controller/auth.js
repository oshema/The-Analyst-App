const ErrorResponse = require('../utills/errorResponse')
const User = require('../models/user')
const cookieParser = require('cookie-parser')

//@desc Register user
//route POST /winner/auth/register
//access public

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role
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









