'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    profileImageRaw: {
        type: String,
        default: '/assets/images/DefaultProf.png'
    },
    bio: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }]
}, {timestamps: true});

userSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password'))
        return next();

    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return console.log(err);
        user.password = hash;
        next();
    });
});

userSchema.methods.comparePasswords = function (passwordAttempt, callback) {
    var user = this;
    bcrypt.compare(passwordAttempt, user.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

userSchema.methods.withoutProps = function () {
    var user = this.toObject();

    for (var i = 0; i < arguments.length; i++) {
        delete user[arguments[i]];
    }
    return user;
};

module.exports = mongoose.model('User', userSchema);