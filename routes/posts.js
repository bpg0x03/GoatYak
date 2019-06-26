const express = require('express');
const router = express.Router();
const post = require('../controllers/Post');

router.post('/newpost', function(req, res){
    post.newPost(req, res)
});

module.exports = router;