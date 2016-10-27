'use strict';

var express = require('express');
var messageRoute = express.Router();

// MODELS
var Message = require('../models/messageSchema');
var Conversation = require('../models/conversationSchema');
var User = require('../models/userSchema');
var Notification = require('../models/notificationSchema');

messageRoute.route('/')
    .get(function (req, res) {
        var user = req.user._id;
        var recipient = req.body.recipient;

        Conversation.find({users: {$in: [user, recipient]}})
            .populate('users')
            .populate({
                path: 'messages'
            })
            .exec(function (err, conversation) {
                if (err) return res.status(500).send(err);
                res.send(conversation);
            })
    })
    .post(function (req, res) {
        var newMessage = new Message(req.body);

        newMessage.message.user = req.user._id;
        newMessage.save();

        Conversation.findOne({$or: [{users: [newMessage.message.user, newMessage.message.recipient]}, {users: [newMessage.message.recipient, newMessage.message.user]}]}, function (err, conversation) {
            if (err) return res.status(500).send(err);

            if (!conversation) {
                var conversationObj = {};
                conversationObj.users = [newMessage.message.user, newMessage.message.recipient];
                var newConversation = new Conversation(conversationObj);
                newConversation.messages.push(newMessage);
                newConversation.save();
            } else if (conversation) {
                conversation.messages.push(newMessage);
                conversation.save();
            }
            User.findById(newMessage.message.recipient, function (err, foundUser) {
                if (err) return res.status(500).send(err);

                var newNotification = new Notification({
                    type: 'message',
                    user: req.user
                });
                newNotification.save();
                foundUser.notifications.unshift(newNotification);
                if (foundUser.notifications.length > 15)
                    foundUser.notifications = foundUser.notifications.slice(0, 14);
                foundUser.save()
            });
            res.send(newConversation || conversation);
        });
    });

messageRoute.route('/markasread/:id')
    .put(function (req, res) {
        Message.findById(req.params.id, function (err, message) {
            if (err) return res.status(500).send(err);

            message.message.readByRecipient = true;
            message.save(function (err, message) {
                if (err) return res.status(500).send(err);

                res.send(message);
            });
        })
    });

messageRoute.route('/conversations/:id')
    .get(function (req, res) {

        Conversation.findById(req.params.id)
            .populate('users', 'username profileImageRaw')
            .populate({
                path: 'messages',
                model: 'Message',
                populate: {
                    path: 'message.user message.recipient',
                    select: 'username profileImageRaw'
                }
            })
            .exec(function (err, conversation) {
                if (err) return res.status(500).send(err);

                res.send(conversation);
            })
    });

messageRoute.route('/conversations')
    .get(function (req, res) {
        Conversation.find({users: {$in: [req.user._id]}})
            .sort({'updatedAt': -1})
            .populate('users', 'username profileImageRaw')
            .populate({
                path: 'messages'
            })
            .exec(function (err, conversations) {
                if (err) return res.status(500).send(err);

                res.send(conversations);
            })
    });

module.exports = messageRoute;
