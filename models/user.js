const mongoose = require('mongoose');
const crypto = require('crypto')
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
    points: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    loses: {
        type: Number,
        default: 0
    },
    wins: {
        type: Number,
        default: 0
    },
    drew: {
        type: Number,
        default: 0
    },
    stats: {
        type: Number,
        default: 0
    },
    resetPasswordToken: String,
    resetPasswordExpier: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//bcrypt password
userScheme.pre('save', async function (next) {

    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userScheme.pre('save', async function (next) {
    if (this.total > 0) {
        this.stats = (this.wins * 100) / this.total;
    }
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

//generate and hash password token
userScheme.methods.getResetPasswordToken = function () {
    //generate token
    const notHashedPasswordToken = crypto.randomBytes(20).toString('hex');

    //hash the token and set to resetPassword field
    this.resetPasswordToken = crypto.createHash('sha256').update(notHashedPasswordToken).digest('hex');

    //set expire
    this.resetPasswordExpier = Date.now() + 10 * 60 * 1000;

    return notHashedPasswordToken

}

module.exports = mongoose.model('User', userScheme);