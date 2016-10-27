'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
    type: {
        type: String,
        enum: ['message', 'mention', 'like', 'comment']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: String,
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Notification', notificationSchema);