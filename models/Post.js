const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
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
