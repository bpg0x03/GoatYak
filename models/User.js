const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
   uid: String,
   secret: String,
   lastUpdated: {type: Date, default: Date.now}
});

//Set the index argument for posts to delete after 2 days
User.index({"lastUpdated": 1}, {expireAfterSeconds: 60*60*24*2});

module.exports = mongoose.model('User', User)