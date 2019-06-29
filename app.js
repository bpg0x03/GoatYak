const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const server = require('http').Server(app)
const io = require('socket.io')(server);
const Post = require('./models/Post');
const posts = require('./routes/posts')
const postcontroller = require('./controllers/Post')

// parse URLencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/db', {useNewUrlParser: true, useCreateIndex: true});
var db = mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB Error'));

app.use('/poster', posts)


io.on('connection', function(socket){
    //Should be the first event sent by client. grab top X posts from the DB
    //msg must have count: the number of posts to return
    socket.on('returnFeed', postcontroller.returnFeed(msg, socket));

    //Handle the new message event, takes the sending socket as an arg
    //so it can emit back to socket either 'update' or 'error'
    socket.on('new-message', postcontroller.newPost(msg,socket));

    //Handle the upvote event
    socket.on('upvote', postcontroller.upvotePost(msg, socket));

    socket.on('downvote', postcontroller.downvotePost(msg, socket));

    //Just return more from DB using msg.requestPostsAfterPostID
    //socket.on('loadmore', postcontroller.loadMore(msg, socket));
});

server.listen(8080, function(){
    console.log("listening on 8080");
});

