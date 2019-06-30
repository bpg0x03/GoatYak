const path = require('path')
const Post = require("../models/Post")
const usercontroller = require("./User")
exports.returnFeed = function(msg, socket) {
    //Return a JSON representation of all posts in the top 50(?) for when client initially connects
    //msg.count is the number of documents to return
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
    console.log(msg);
    usercontroller.verifyUser(msg, socket, function(){
        newPost.save( function(err,doc){
            if(err){
                socket.emit('dbError', err);
            }
            else{
                socket.emit('update', newPost);//send back the new post to update the one person that sent it
                //maybe just send back the post? then database interactions only have to happen when clients connect originally
                socket.broadcast.emit('updateNotify',"all")//tell every other client to refresh
            }
        });
    });
}


//What if they want to upvote then downvote? need to delete old vote and make new one.
exports.votePost = function(msg, socket){
    //Find post by ID, add UID of client to upvotes list
    // msg must contain uid, and post id
    var vote = {uid: msg.uid, val: msg.val};

    Post.exists(
        { $and: [ {_id: msg._id}, {votes: { $elemMatch: { uid: msg.uid } } } ] }, 
        function(err, foundVote){
            console.log(foundVote)
            if(foundVote){
                Post.updateOne(
                    { $and: [ {_id: msg._id}, {votes: { $elemMatch: { uid: msg.uid } } } ] },
                    { $set: {'votes.$.val': msg.val } },
                    //{ arrayFilters: [ {'element': {uid: msg.uid}} ]},
                    function(err, voteObj){
                        if(err){
                            console.log(err)
                        }
                        else{
                            console.log("successChangedVote")
                            socket.emit('update', voteObj)
                            socket.emit('updateNotify', "all")
                        }
                    }
                )
            }
            else{
                Post.updateOne(
                    { _id: msg._id},//find by id
                    { $push: { votes: vote } },
                    { new: true, useFindAndModify: false },//flag makes it return the updated doc 
                    function(err, doc){
                        if(err){
                            console.log(err)
                        }
                        else{
                            console.log('successNewVote')
                            socket.emit('update', doc)
                            socket.broadcast.emit('updateNotify', "all")
                        }

                    }
                )

            }
                
        }

    );
    
}

exports.commentPost = function(msg, socket){

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