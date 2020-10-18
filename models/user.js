const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const jwt = require('jsonwebtoken')

const userScheme = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter a name']
    },
    email: {
        type: String,
        required: [true, 'please enter email'],
        validate: [isEmail, 'invalid email']
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    password: {
        type: String,
        required: [true, 'please enter password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpierd: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//bcrypt password
userScheme.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//sign jwt and return
userScheme.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

//match user password to hashed password in DB
userScheme.methods.matchPassword = async function (loginPassword) {
    return await bcrypt.compare(loginPassword, this.password);
}



module.exports = mongoose.model('user', userScheme);