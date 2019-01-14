'use strict';
const socketIO = require('socket.io');

function socketEvents(io) {
  io.on('connection', (socket) => {
    socket.on('enter conversation', (conversation) => {
      socket.join(conversation);
    });

    socket.on('leave conversation', (conversation) => {
      socket.leave(conversation);
    })

    socket.on('new message', (conversation) => {
      io.sockets.in(conversation).emit('refresh messages', conversation);
    });

    socket.on('disconnect', () => {

    });
  });
}

module.exports = (server) => {
  socketEvents(server/*socketIO.listen(server)*/);
}
