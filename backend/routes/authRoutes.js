'use strict';

// NODE MODULES
var express = require('express');
var authRoute = express.Router();
var jwt = require('jsonwebtoken');

var config = require('../config');

// MODELS
var User = require('../models/userSchema');

authRoute.route('/signup')
    .post(function (req, res) {
        User.findOne({username: req.body.username.toLowerCase()}, function (err, existingUser) {

            if (err) return res.status(500).send(err);

            if (existingUser) {
                res.send({
                    success: false,
                    message: 'This username is not available',
                    duplicate: 'username'
                })
            } else if (!existingUser) {
                User.findOne({email: req.body.email.toLowerCase()}, function (err, existingUser) {
                    if (err) res.status(500).send(err);

                    if (existingUser) {
                        res.send({
                            success: false,
                            message: 'This email is already tied to an account',
                            duplicate: 'email'
                        })
                    } else if (!existingUser) {
                        var newUser = new User(req.body);
                        newUser.following.push('5811ff90a7eea95261661f96');
                        User.findOne({_id: '5811ff90a7eea95261661f96'}, function (err, admin) {
                            if (err) res.status(500).send(err);
                            admin.followers.push(newUser._id);
                            admin.save();
                        });
                        newUser.save(function (err, savedUser) {
                            if (err) return res.status(500).send(err);
                            res.send(savedUser);
                        })
                    }
                })
            }
        })
    });

authRoute.route('/login')
    .post(function (req, res) {
        User.findOne({username: req.body.username.toLowerCase()}, function (err, user) {
            if (err) return res.status(401).send(err);
            if (!user) {
                res.send({
                    success: false,
                    message: 'This user does not exist',
                    field: 'username'
                })
            } else if (user) {
                user.comparePasswords(req.body.password, function (err, isMatch) {
                    if (err) return res.status(401).send(err);
                    if (!isMatch) {
                        res.send({
                            success: false,
                            message: 'The password entered is incorrect',
                            field: 'password'
                        })
                    } else if (isMatch) {
                        var token = jwt.sign(user.withoutProps('password', 'profileImageRaw'), config.secret, {expiresIn: '24h'});

                        res.send({
                            success: true,
                            user: user.withoutProps('password', 'profileImageRaw'),
                            token: token,
                            message: 'Token granted'
                        })
                    }
                })
            }
        })
    });

module.exports = authRoute;
