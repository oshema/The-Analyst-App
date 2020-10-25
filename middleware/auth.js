const ErrorResponse = require('../utills/errorResponse')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies.token) {
            token = req.cookies.token;
        }

        //check token exist
        if (!token) {
            return next(new ErrorResponse('You dont have a permission to access this routh', 401))
        }

        //verify token
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id)

            next();
        }
        catch (err) {
            return next(err)
        }
    }
    catch (err) {
        next(err)
    }
}

exports.authorize = (...roles) => {
    return async (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                next(new ErrorResponse(`your role: ${req.user.role} is not autorized`), 403)
            }
            next();

        }
        catch (err) {
            next(err)
        }
    }
}