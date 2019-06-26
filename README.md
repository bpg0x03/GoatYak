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
Functions for interacting with the database and request/response

### routes/posts.js

Handles the routes for localhost:8080/posts/*. These are the URLS that will be posted to to interact with server.
Each route should be attached to a controller function
