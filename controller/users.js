
const ErrorResponse = require('../utills/errorResponse')
const User = require('../models/user')


//@desc get all user
//route GET /winner/users
//access private/admin

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(
            {
                success: true,
                msg: 'Show all users',
                count: users.length,
                data: users
            })
    }
    catch (err) {
        next(err)
    }
}

//@desc get single user
//route GET /winner/users/:id
//access private/admin

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(
            {
                success: true,
                data: user
            })
    }
    catch (err) {
        next(err)
    }
}

//@desc create user
//route POST /winner/users
//access private/admin

exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(
            {
                success: true,
                data: user
            })
    }
    catch (err) {
        next(err)
    }
}

//@desc update user
//route PUT /winner/users/:id
//access private/admin

exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json(
            {
                success: true,
                data: user
            })
    }
    catch (err) {
        next(err)
    }
}

//@desc delete user
//route DELETE /winner/users/:id
//access private/admin

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        res.status(200).json(
            {
                success: true,
                msg: 'user has been deleted',
                data: user
            })
    }
    catch (err) {
        next(err)
    }
}





