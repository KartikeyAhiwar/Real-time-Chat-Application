// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

// Configurations
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(`Error: ${err}`));

const server = http.createServer(app);
const io = socketIO(server);

// Real-time Socket.IO implementation
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('sendMessage', ({ message, room }) => {
    io.to(room).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
