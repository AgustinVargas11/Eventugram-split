'use strict';

var express = require('express');
var notificationRoute = express.Router();

var Notification = require('../models/notificationSchema');

notificationRoute.route('/:notificationId/markasseen')
    .put(function(req, res) {
        Notification.findById(req.params.notificationId, function(err, notification) {
            if (err) return res.status(500).send(err);

            notification.seen = true;
            notification.save(function(err, savedNotification) {
                if (err) res.status(500).send(err);
                res.send(savedNotification);
            })
        })
    });

module.exports = notificationRoute;