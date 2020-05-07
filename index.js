const express = require('express')

const serverRouter = require('./server')
const server = express()

server.use('/', serverRouter)

server.listen(4000, () => {
  console.log('server running on port 4000')
})