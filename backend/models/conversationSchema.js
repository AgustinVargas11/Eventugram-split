'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conversationSchema = new Schema({
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true});

module.exports = mongoose.model('Conversation', conversationSchema);