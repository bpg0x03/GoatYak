const path = require('path')
const Post = require("../models/Post")

exports.returnFeed = function(msg, socket) {
    //Return a JSON representation of all posts in the top 50(?) for when client initially connects
    //msg.count is the number of documents to return
    Post.find().sort( { _id: -1 } ).limit(msg.count).exec(function(err, items){
        if(err){
            socket.emit('error', err);
        }

        else{
            socket.emit('update', items)//send all the items back to socket
        }
    });
}

exports.newPost = function(msg, socket){
    //Add a post to the database, to be invoked upon server recieving 'post' event from client
    var newPost = new Post(msg);
    console.log(msg);
    newPost.save( function(err){
        if(err){
            socket.emit('error', err);
        }
        else{
            socket.emit('update', newPost);//send back the new post to update the one person that sent it
            //maybe just send back the post? then database interactions only have to happen when clients connect originally
            socket.broadcast.emit('updateNotify',"all")//tell every other client to refresh
        }
    });
}

exports.upvotePost = function(msg, socket){
    //Find post by ID, add UID of client to upvotes list
    // msg must contain uid, and post id
    var vote = {uid: msg.uid, val: 1};
    Post.findOneAndUpdate(
        { _id: msg._id},//find by id
        { $push: { votes: vote } },//push our new vote to the votes array
        { new: true },//flag makes it return the updated doc 
        function(err, doc){
            if(err){
                socket.emit('error', err);
            }
            else{
                socket.emit('update', doc)//update the one client
                socket.broadcast.emit('updateNotify', "all")//tell every other client to refresh, maybe just send back the post?
            }
        });
}

exports.downvotePost = function(msg, socket){
    //Same as prev but for downvoting
    //msg again contains uid, post id
    var vote = {uid: msg.uid, val: -1};

    Post.findOneAndUpdate(
        {_id: msg._id},
        { $push: { votes: vote } },
        { new: true },
        function(err, doc){
            if(err){
                socket.emit('error', err);
            }
            else{
                socket.emit('update', doc);
                socket.broadcast.emit('updateNotify', "all");
            }
        }
    );

}