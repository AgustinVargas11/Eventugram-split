'use strict';

// REQUIRE NODE MODULES
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var expressJwt = require('express-jwt');

// REQUIRE FILES
var config = require('./config');
var authRoutes = require('./routes/authRoutes');
var postRoutes = require('./routes/postRoute');
var userRoutes = require('./routes/userRoutes');
var messageRoutes = require('./routes/messageRoute');
var notificationRoute = require('./routes/notificationRoute');

// SERVER
var app = express();
var port = process.env.PORT || 8082;

// MIDDLEWARE
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', expressJwt({secret: config.secret}));
app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/notification', notificationRoute);

mongoose.connect(config.database, function () {
    console.log('Connected to mongodb');
});

var server = app.listen(port, function () {
    console.log('Server is listening on port', port + '...');
});

// SOCKET io SETUP
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('a user has connected to the chat');

    socket.on('privateChat', function (data) {
        console.log('joining', data.chat);
        socket.join(data.chat);
    });

    socket.on('newMessage', function (message, chat) {
        io.sockets.in(chat).emit('incomingMessage', message);
    });
});

