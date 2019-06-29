# GoatYak
## Don't forget to run 'npm i' to install dependencies!
## When adding a new dependency, use 'npm install --save NAME' to update
YikYak esque web app using socket.io, node.js, mongodb, and angular

## Project Structure
### app.js
Brings everything together, contains DB connection and express base routing configs

### models/Post.js
 The databasing schema and model for interacting with mongo

### controllers/Post.js 
Functions for interacting with the database and request/response\
Prototypes/parameter expectations:\
`postcontroller.returnFeed(msg, socket)`\
msg = { count: Number }\
\
`postcontroller.newPost(msg,socket)`\
msg = Post object, see models/Post.js\
\
`postcontroller.upvotePost(msg, socket)`\
msg = { _id: "POSTID", uid: "USERID" }\
\
`postcontroller.downvotePost(msg, socket)`\
msg = { _id: "POSTID", uid: "USERID" }\
\
`postcontroller.loadMore(msg, socket)`\
msg = { lastID: "POSTID", count: Number }\



### routes/posts.js

Handles the routes for localhost:8080/posts/*. These are the URLS that will be posted to to interact with server.
Each route should be attached to a controller function
