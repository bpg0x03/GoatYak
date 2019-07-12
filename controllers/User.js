const path = require('path')
const User = require("../models/User")
const rand = require('crypto-random-string')
const UID = require('./UID')
//check msg.UID and msg.nonce against db, if not existant, generate new one
exports.verifyUser = function(msg, socket, callback){
    User.findOne( { uid: msg.uid }, function(err, user){
        if(user){
            if(user.secret == msg.secret){
                //add user time verification here
                if(callback)
                    callback(user)
            }
            else{
                module.exports.newUser(socket)
            }
        }
        else{
            module.exports.newUser(socket)
        }
    });
}

exports.newUser = function(socket){
    var user = new User({
        uid: UID.getUID(),
        secret: rand({length: 32})
    });

    user.save()

    socket.emit('newUser', {uid: user.uid, secret: user.secret});
}