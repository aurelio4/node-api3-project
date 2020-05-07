const express = require('express');
const posts = require('./posts/postRouter')
const users = require('./users/userRouter')

const server = express();

server.use(express.json())

server.use('/posts', posts)
server.use('/user', users)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

server.use(function logger(req, res, next) {
  const date = new Date().toISOString()
  console.log(`${date} ${req.method} ${req.url}`)
  next()
})

module.exports = server;
