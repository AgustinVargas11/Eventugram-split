'use strict';

// NODE MODULES
var express = require('express');
var postRoute = express.Router();
var multipart = require('connect-multiparty');
var multipartyMiddleWare = multipart();
var fs = require('fs');

// MODELS
var User = require('../models/userSchema');
var Post = require('../models/postSchema');
var Notification = require('../models/notificationSchema');

postRoute.use('*', multipartyMiddleWare);

postRoute.route('/')
    .get(function (req, res) {
        var user = req.user._id;

        User.findById(user, function (err, foundUser) {
            if (err) return res.status(500).send(err);

            foundUser.following.push(user);
            var query = foundUser.following.concat(user);

            Post.find({user: {$in: query}})
                .sort({'createdAt': -1})
                .populate({
                    path: 'user',
                    select: 'username profileImageRaw'
                })
                .populate({
                    path: 'comments.user',
                    model: 'User',
                    select: 'username'
                })
                .exec(function (err, posts) {
                    if (err) return res.status(500).send(err);
                    res.send(posts);
                })
        })
    })
    .post(function (req, res) {
        var newPost = new Post(req.body);

        newPost.user = req.user;
        var data = fs.readFileSync(req.files.file.path);
        var contentType = req.files.file.type;

        newPost.postImage = 'data:' + contentType + ';base64,' + data.toString('base64');

        newPost.save(function (err, newPost) {
            if (err) return res.status(500).send(err);
            User.findById(req.user._id, function (err, foundUser) {
                foundUser.posts.push(newPost);
                foundUser.save(function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
            });
        });
    });

postRoute.route('/:postId')
    .get(function (req, res) {
        var post = req.params.postId;
        Post.findById(post, '-password')
            .populate('user')
            .populate({
                path: 'comments.user',
                model: 'User'
            })
            .exec(function (err, post) {
                if (err) res.status(500).send(err);

                res.send(post);
            });
    });


postRoute.route('/:postId/comment')
    .put(function (req, res) {
        var post = req.params.postId;
        req.body.user = req.user;
        Post.findById(post, function (err, post) {
            if (err) return res.status(500).send(err);

            post.comments.push(req.body);

            post.save(function (err, savedComment) {
                if (err) return res.status(500).send(err);

                User.findById(post.user, function (err, user) {
                    if (err) return res.status(500).send(err);

                    var notificationObj = {
                        type: 'comment',
                        user: req.user,
                        comment: req.body.comment,
                        post: post._id
                    };
                    var newNotification = new Notification(notificationObj);
                    newNotification.save();

                    user.notifications.unshift(newNotification);
                    if (user.notifications.length > 15)
                        user.notifications = user.notifications.slice(0, 14);
                    user.save();
                });
                return res.send(savedComment.comments[savedComment.comments.length - 1].comment);
            })
        });
    });

postRoute.route('/:postId/like')
    .put(function (req, res) {
        req.body.user = req.user;

        Post.findById(req.params.postId, function (err, post) {
            if (err) return res.status(500).send(err);

            var like = req.body.user._id;

            if (post.likes.indexOf(like) >= 0) {
                post.likes.remove(like);
            } else {
                User.findById(post.user)
                    .populate('notifications')
                    .exec(function (err, user) {
                        var notificationObj = {
                            type: 'like',
                            user: req.user,
                            post: post
                        };
                        var newNotification = new Notification(notificationObj);
                        newNotification.save();

                        if (newNotification.post._id !== user.notifications[0].post)
                            user.notifications.unshift(newNotification);

                        if (user.notifications.length > 15)
                            user.notifications = user.notifications.slice(0, 14);
                        user.save();
                    });
                post.likes.push(like);
            }

            post.save(function (err, like) {
                if (err) return res.status(500).send(err);

                res.send(like);
            })
        })
    });

postRoute.route('/delete/:id')
    .delete(function (req, res) {
        Post.findByIdAndRemove(req.params.id, function (err, post) {
            if (err) return res.status(500).send(err);

            User.findById(req.user._id, function (err, foundUser) {
                foundUser.posts.remove(req.params.id);
                foundUser.save(function (err) {
                    if (err) return res.status(500).send(err);
                })
            });
            res.send(post);
        });
    });

module.exports = postRoute;