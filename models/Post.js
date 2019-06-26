const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
   uid: String,
   text: String,
   votes: [{
      uid: String
   }],
   comments:[{
      uid: String,
      text: String,
      votes: [{
         uid: String
      }],
   }]
});

//Set the index argument for posts to delete after 1 minute
Post.index({"createdAt": 1}, {expireAfterSeconds: 60});

module.exports = mongoose.model('Post', Post)