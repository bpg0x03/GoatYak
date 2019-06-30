const path = require('path')
const User = require("../models/User")

//check msg.UID and msg.nonce against db, if not existant, generate new one
exports.getUser = function(msg, socket){
}