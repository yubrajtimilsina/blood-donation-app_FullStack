const app = require('./app');
const dotenv = require('dotenv');
const dbConnection = require('./utils/db');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

// Port from env with fallback
const PORT = process.env.PORT || 3000

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175'
    ],
    credentials: true
  }
});

// Store online users
const onlineUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with their user ID
  socket.on('join', (userId) => {
    socket.userId = userId;
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      const { chatId, message, senderId, receiverId } = data;

      // Save message to database (you'll need to implement this)
      // const savedMessage = await saveMessage(chatId, message, senderId);

      // Emit to receiver if online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', {
          chatId,
          message,
          senderId,
          timestamp: new Date()
        });
      }

      // Emit back to sender for confirmation
      socket.emit('messageSent', {
        chatId,
        message,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const { chatId, receiverId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userTyping', { chatId, senderId: socket.userId });
    }
  });

  socket.on('stopTyping', (data) => {
    const { chatId, receiverId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userStopTyping', { chatId, senderId: socket.userId });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected`);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Make io available globally (for controllers)
global.io = io;

//Server setup
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    dbConnection();
});
