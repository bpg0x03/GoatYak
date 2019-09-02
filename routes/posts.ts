//THIS WILL BE REMOVED IN FINAL VERSION
//POSTS WILL BE HANDLED FROM SOCKET, NOT FROM 
//POST ROUTE
const express = require('express');
const router = express.Router();
const post = require('../controllers/Post');

router.post('/newpost', function(req, res){
    post.newPost(req, res)
});

module.exports = router;