const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const server = require('http').Server(app)
const io = require('socket.io')(server);
const posts = require('./routes/posts')//DONT NEED THIS IN FINAL
const postcontroller = require('./controllers/Post')
const usercontroller = require('./controllers/User')

// parse URLencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/db', {useNewUrlParser: true, useCreateIndex: true});
var db = mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB Error'));

app.use('/poster', posts)//DONT NEED THIS IN FINAL


io.on('connection', function(socket){
    console.log('connected')

    socket.on('getUser', function(msg){usercontroller.verifyUser(msg, socket)})
    //Should be the second event sent by client. grab top X posts from the DB
    //msg must have count: the number of posts to return
    socket.on('returnFeed', function(msg){postcontroller.returnFeed(msg, socket)});

    //Handle the new message event, takes the sending socket as an arg
    //so it can emit back to socket either 'update' or 'error'
    socket.on('new-message', function(msg){postcontroller.newPost(msg,socket)});

    //Handle the vote event
    socket.on('vote', function(msg){postcontroller.votePost(msg, socket)});

    //Handle comments
    socket.on('comment', function(msg){postcontroller.commentPost(msg, socket)})

    //Handle comment votes
    socket.on('voteComment', function(msg){postcontroller.voteComment(msg, socket)})
    //Just return more from DB using msg.requestPostsAfterPostID
    socket.on('loadmore', function(msg){postcontroller.loadMore(msg, socket)});
});

server.listen(8080, function(){
    console.log("listening on 8080");
});

