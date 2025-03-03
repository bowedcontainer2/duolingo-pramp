const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { ExpressPeerServer } = require('peer');

const app = express();
const server = http.createServer(app);

// Basic CORS
app.use(cors());

// Socket.IO setup
const io = socketIo(server, {
  cors: { origin: "*" }
});

// PeerJS setup
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/'
});

app.use('/peerjs', peerServer);

// Simple room tracking
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-room', (roomId, peerId) => {
    socket.join(roomId);
    socket.to(roomId).emit('peer-joined', peerId);
    console.log(`Socket ${socket.id} joined room ${roomId} with peer ID ${peerId}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Start server
const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 