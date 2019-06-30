const path = require('path')
const User = require("../models/User")
const rand = require('crypto-random-string')

//check msg.UID and msg.nonce against db, if not existant, generate new one
exports.verifyUser = function(msg, socket){
    User.findOne( { uid: msg.uid }, function(err, user){
        if(user){
            if(user.secret == msg.secret){
                socket.emit('userValid', msg)
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
        uid: rand({length: 32}),//make this something more readable like from a wordlist
        secret: rand({length: 32})
    });

    user.save()

    socket.emit('newUser', {uid: user.uid, secret: user.secret});
}