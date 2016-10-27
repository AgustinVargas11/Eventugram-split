'use strict';

// NODE MODULES
var express = require('express');
var userRoute = express.Router();
var multipart = require('connect-multiparty');
var multipartyMiddleWare = multipart();
var fs = require('fs');

// MODELS
var User = require('../models/userSchema');


userRoute.use('*', multipartyMiddleWare);

userRoute.route('/query')
    .get(function (req, res) {
        User.find({username: {$in: [new RegExp('^' + req.query.username)]}}, function (err, users) {
            if (err) return res.status(500).send(err);

            res.send(users);
        });
    });

userRoute.route('/userprofile')
    .get(function (req, res) {
        User.findById(req.user, '-password')
            .populate({
                path: 'posts',
                options: {sort: {'createdAt': -1}}
            })
            .populate({
                path: 'notifications',
                match: {
                    $or: [{type: 'like'}, {type: 'mention'}, {type: 'comment'}]
                },
                populate: {
                    path: 'post user',
                    select: 'postImage user username',
                    populate: {
                        path: 'user',
                        select: 'username'
                    }
                }
            })
            .exec(function (err, user) {
                res.send(user);
            });
    })
    .put(function (req, res) {
        var user = req.user._id;
        var update = req.body;
        User.findByIdAndUpdate(user, update, {new: true}, function (err, updatedUser) {
            if (err) return res.status(500).send(err);
            res.send(updatedUser);
        });
    });

userRoute.route('/userprofile/profileimage/')
    .post(function (req, res) {
        var user = req.user._id;

        User.findById(user, function (err, foundUser) {
            if (err) res.status(500).send(err);

            var data = fs.readFileSync(req.files.file.path);
            var contentType = req.files.file.type;

            foundUser.profileImageRaw = 'data:' + contentType + ';base64,' + data.toString('base64');

            foundUser.save(function (err) {
                if (err) throw err;
                console.error('saved img to mongo');
            });
        });
    });

userRoute.route('/profile/:id')
    .get(function (req, res) {
        if (req.params.id === undefined)
            return res.send({message: 'id is undefined'});

        User.findById(req.params.id, '-password -email')
            .populate({
                path: 'posts',
                options: {sort: {'createdAt': -1}}
            })
            .exec(function (err, user) {
                if (err) return res.status(500).send(err);

                if (user)
                    res.send(user);
            });
    });

userRoute.route('/following/user/:id')
    .get(function (req, res) {
        User.findById(req.user, function (err, user) {
            if (err) return res.status(500).send(err);

            if (user.following.length) {
                if (user.following.indexOf(req.params.id) >= 0) {
                    return res.send(user.following[req.params.id])
                }
            }
            res.send({message: 'not found'});
        })
    });

userRoute.route('/following/add/:userId')
    .patch(function (req, res) {
        User.findById(req.user, function (err, user) {
            if (err) return res.status(500).send(err);

            if (user.following.indexOf(req.params.userId) >= 0) {
                user.following.remove(req.params.userId);

                User.findById(req.params.userId, function (err, foundUser) {
                    foundUser.followers.remove(user._id);
                    foundUser.save();
                });

                user.save();
                return res.send({message: 'unfollowed user', code: 1});
            } else {
                user.following.push(req.params.userId);
                user.save();
                User.findById(req.params.userId, function (err, foundUser) {
                    foundUser.followers.push(user);
                    foundUser.save();
                });
                return res.send({message: 'followed user', code: 0});
            }
        })
    });

userRoute.route('/following')
    .get(function (req, res) {
        var user = req.user._id;
        User.findById(user)
            .populate('following followers', 'username profileImageRaw')
            .select('username profileImageRaw following followers')
            .exec(function (err, user) {
                if (err) return res.status(500).send(err);
                res.send(user);
            });
    });

module.exports = userRoute;