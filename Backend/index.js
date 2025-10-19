const app = require('./app');
const dotenv = require('dotenv');
const dbConnection = require('./utils/db');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

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

// Store online users with additional info
const onlineUsers = new Map(); // userId -> { socketId, role }
const userSockets = new Map(); // socketId -> userId

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // User joins with their user ID and role
  socket.on('join', (data) => {
    const { userId, role } = data;
    socket.userId = userId;
    socket.userRole = role;
    onlineUsers.set(userId, { socketId: socket.id, role });
    userSockets.set(socket.id, userId);
    
    console.log(`👤 User ${userId} (${role}) joined with socket ${socket.id}`);
    
    // Broadcast user online status
    io.emit('userOnline', { userId, role, status: 'online' });
  });

  // Join user to a chat room
  socket.on('joinChat', (chatId) => {
    socket.join(`chat-${chatId}`);
    console.log(`📌 User ${socket.userId} joined chat room: chat-${chatId}`);
  });

  // Handle sending messages with real-time updates
  socket.on('sendMessage', async (data) => {
    try {
      const { chatId, message, senderId, receiverId, timestamp } = data;

      // Broadcast to chat room (including sender for real-time update)
      io.to(`chat-${chatId}`).emit('receiveMessage', {
        chatId,
        message,
        senderId,
        senderName: socket.userRole,
        timestamp: timestamp || new Date()
      });

      console.log(`📨 Message sent in chat ${chatId} by ${senderId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  // Typing indicators
  socket.on('typing', (data) => {
    const { chatId, receiverId, senderName } = data;
    io.to(`chat-${chatId}`).emit('userTyping', { 
      chatId, 
      senderId: socket.userId,
      senderName,
      status: 'typing'
    });
  });

  socket.on('stopTyping', (data) => {
    const { chatId } = data;
    io.to(`chat-${chatId}`).emit('userStopTyping', { 
      chatId, 
      senderId: socket.userId 
    });
  });

  // Message read receipt
  socket.on('messageRead', (data) => {
    const { chatId, messageId } = data;
    io.to(`chat-${chatId}`).emit('messageReadReceipt', { 
      messageId,
      readBy: socket.userId,
      readAt: new Date()
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.userId) {
      const userData = onlineUsers.get(socket.userId);
      onlineUsers.delete(socket.userId);
      userSockets.delete(socket.id);
      
      io.emit('userOffline', { 
        userId: socket.userId, 
        status: 'offline'
      });
      
      console.log(`👋 User ${socket.userId} disconnected`);
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

global.io = io;

server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    dbConnection();
});