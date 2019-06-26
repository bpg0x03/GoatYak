const path = require('path')
const Post = require("../models/Post")

exports.returnFeed = function(req, res) {
    //Return a JSON representation of all posts in the top 50(?)
}

exports.newPost = function(req, res){
    //Add a post to the database, to be invoked upon server recieving 'post' event from client
    var newPost = new Post(req.body);
    console.log(req.body);
    newPost.save( function(err){
        if(err){
            res.status(400).send("Could not add post to database");
        }
        else{
            res.status(201).send(newPost);
        }
    });
}

exports.upvotePost = function(req, res){
    //Find post by ID, add UID of client to upvotes list
}

exports.downvotePost = function(req, res){
    //Same as prev but for downvoting
}