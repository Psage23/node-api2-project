const express = require('express')
const postRouter = require('./Routers/postRouter');
const server = express()

server.use(express.json());
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
    res.send('Hello world!');
})

module.exports = server;