const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const server = require('http').Server(app)
const io = require('socket.io')(server);
const Post = require('./models/Post');
const posts = require('./routes/posts')

// parse URLencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


mongoose.connect('mongodb://localhost:27017/db', {useNewUrlParser: true, useCreateIndex: true});
var db = mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB Error'));

app.use('/poster', posts)

server.listen(8080, function(){
    console.log("listening on 8080");
});

