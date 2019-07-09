# GoatYak
## Don't forget to run 'npm i' to install dependencies!
## When adding a new dependency, use 'npm install --save NAME' to update
YikYak esque web app using socket.io, node.js, mongodb, and angular

## Project Structure

##Angular
### Post Class
Defines fields and whatnot for posts
### Post Service
Contains the observable to the actual socket io integration as well as the methods for new posts comments votes etc
SelectedPost field will be passed into post context 
### Post-List-Component
Listing out all the posts and their upvote counts etc
contains new post button and functionality
### Post-Context-Component
Showing the posts comments and changing view to just the one post contains new comment button and functionality

### app.js
Brings everything together, contains DB connection and express base routing configs

### models/Post.js
 The databasing schema and model for interacting with mongo

 ### models/User.js
 The databasing schema and model for user objects. Will contain UID, server issued secret, and last updated time. Old users
 will be pruned, Users won't be able to post too

### controllers/User.js
Functions for interacting with users db\
`usercontroller.getUser(msg, socket)`\
msg = { uid: String, nonce: String }

### controllers/Post.js 
Functions for interacting with the database and request/response\
Prototypes/parameter expectations:\
`postcontroller.returnFeed(msg, socket)`\
msg = { count: Number }\
\
`postcontroller.newPost(msg,socket)`\
msg = Post object, see models/Post.js\
\
`postcontroller.votePost(msg, socket)`\
msg = { _id: "POSTID", val: 1 or -1 , user: USER OBJ for verification}\
\
\
`postcontroller.loadMore(msg, socket)`\
msg = { lastID: "POSTID", count: Number }\



### routes/posts.js

Handles the routes for localhost:8080/posts/*. These are the URLS that will be posted to to interact with server.
Each route should be attached to a controller function
