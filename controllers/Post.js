const path = require('path')
const Post = require("../models/Post")
const usercontroller = require("./User")
const uid = require('./UID')


exports.returnFeed = function(msg, socket) {
    //Return a JSON representation of all posts in the top 50(?) for when client initially connects
    //msg.count is the number of documents to return
    //msg = JSON.parse(msg)
    Post.find().sort( { _id: -1 } ).limit(msg.count).exec(function(err, items){
        if(err){
            socket.emit('dbError', err);
        }

        else{
            socket.emit('update', items)//send all the items back to socket
        }
    });
}

exports.newPost = function(msg, socket){
    //Add a post to the database, to be invoked upon server recieving 'post' event from client
    var newPost = new Post(msg.post);
    usercontroller.verifyUser(msg.user, socket, function(user){
        newPost.save( function(err,doc){
            if(err){
                socket.emit('dbError', err);
            }
            else{
                socket.emit('addOne', newPost);//send back the new post to update the one person that sent it
                //maybe just send back the post? then database interactions only have to happen when clients connect originally
                socket.broadcast.emit('addOne',newPost)//tell every other client to refresh
            }
        });
    });
}


exports.votePost = function(msg, socket){
    //Find post by ID, add UID of client to upvotes list
    // msg must contain uid, and post id
    usercontroller.verifyUser(msg.user, socket, function(user){
        Post.exists(
            { $and: [ {_id: msg._id}, {votes: { $elemMatch: { uid: JSON.parse(msg.user).uid } } } ] }, 
            function(err, foundVote){
                if(foundVote){
                    Post.findOneAndUpdate(
                        { $and: [ {_id: msg._id}, {votes: { $elemMatch: { uid: JSON.parse(msg.user).uid } } } ] },
                        { $set: {'votes.$.val': msg.val } },
                        { new: true, useFindAndModify: false },
                        function(err, voteObj){
                            if(err){
                                console.log(err)
                            }
                            else{
                                socket.emit('updateOne', voteObj)
                                socket.broadcast.emit('updateOne', voteObj)
                            }
                        }
                    )
                }
                else{
                    Post.findOneAndUpdate(
                        { _id: msg._id},//find by id
                        { $push: { votes: {uid: JSON.parse(msg.user).uid, val:msg.val} } },
                        { new: true, useFindAndModify: false },//flag makes it return the updated doc 
                        function(err, doc){
                            if(err){
                                console.log(err)
                            }
                            else{
                                socket.emit('updateOne', doc)
                                socket.broadcast.emit('updateOne', doc)
                            }
    
                        }
                    )
    
                }
                    
            }
    
        );
    });
}

exports.commentPost = function(msg, socket){
    usercontroller.verifyUser(msg.user, socket, function(user){
        Post.findOneAndUpdate(
            {_id: msg.post._id},
            {   $push: { 
                    comments: {
                        uid: JSON.parse(msg.user).uid,
                        text: msg.text
                    }
                }
            },
            {new: true, useFindAndModify: false},
            function(err, doc){
                if(err){console.log(err)}
                else{
                    socket.emit('updateOne', doc)
                    socket.broadcast.emit('updateOne', doc)
                }
            }
        );
    });
}

exports.voteComment = function(msg, socket){
    usercontroller.verifyUser(msg.user, socket, function(user){

    })
}

exports.loadMore = function(msg, socket){
    Post.find({_id: {$gt: msg.lastID}}).sort({_id : -1}).limit(msg.count).exec(function(err, items){
        if(err){
            socket.emit('dbError', err);
        }   
    
        else{
            socket.emit('update', items)//send all the items back to socket
        }
    });
}