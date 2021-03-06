const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
   uid: String,
   text: String,
   votes: [{
       uid: String,
       val: Number
   }]
});

const Post = new Schema({
   uid: String,
   createdAt: {type: Date, default: Date.now},
   text: String,
   votes: [{
      uid: String,
      val: Number
   }],
   comments:[Comment]
});



//Set the index argument for posts to delete after 1 minute
Post.index({"createdAt": 1}, {expireAfterSeconds: 3600});

module.exports = mongoose.model('Post', Post)