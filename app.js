const mongoose = require('mongoose');
const client = require('socket.io').listen(4000).sockets;
const Post = require('./models/Post.js');

mongoose.connect('mongodb://localhost:27017/db', {useNewUrlParser: true});
