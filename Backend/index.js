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
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Store online users with additional info
const onlineUsers = new Map(); // userId -> { socketId, role, socketInstance }
const userSockets = new Map(); // socketId -> userId

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // User joins with their user ID and role
  socket.on('join', (data) => {
    const { userId, role } = data;
    socket.userId = userId;
    socket.userRole = role;
    
    // Store user with socket instance
    onlineUsers.set(userId, { 
      socketId: socket.id, 
      role,
      socketInstance: socket 
    });
    userSockets.set(socket.id, userId);
    
    // Join user-specific room
    socket.join(`user-${userId}`);
    
    console.log(`👤 User ${userId} (${role}) joined with socket ${socket.id}`);
    
    // Broadcast user online status
    io.emit('userOnline', { userId, role, status: 'online' });
    
    // Send current online users list
    const onlineUsersList = Array.from(onlineUsers.entries()).map(([id, data]) => ({
      userId: id,
      role: data.role,
      status: 'online'
    }));
    socket.emit('onlineUsers', onlineUsersList);
  });

  // Join user to a chat room
  socket.on('joinChat', (chatId) => {
    socket.join(`chat-${chatId}`);
    console.log(`📌 User ${socket.userId} joined chat room: chat-${chatId}`);
    
    // Notify other participants
    socket.to(`chat-${chatId}`).emit('userJoinedChat', {
      chatId,
      userId: socket.userId,
      role: socket.userRole
    });
  });

  // Leave chat room
  socket.on('leaveChat', (chatId) => {
    socket.leave(`chat-${chatId}`);
    console.log(`👋 User ${socket.userId} left chat room: chat-${chatId}`);
    
    socket.to(`chat-${chatId}`).emit('userLeftChat', {
      chatId,
      userId: socket.userId
    });
  });

  // Handle sending messages with real-time updates
  socket.on('sendMessage', async (data) => {
    try {
      const { chatId, message, senderId, receiverId, timestamp } = data;

      // Broadcast to chat room (excluding sender to avoid duplicate messages)
      socket.to(`chat-${chatId}`).emit('receiveMessage', {
        chatId,
        message,
        senderId,
        senderName: socket.userRole,
        timestamp: timestamp || new Date()
      });

      // Send direct notification to receiver if online
      if (receiverId && onlineUsers.has(receiverId)) {
        io.to(`user-${receiverId}`).emit('newMessageNotification', {
          chatId,
          senderId,
          preview: message.content?.substring(0, 50) || 'New message'
        });
      }

      console.log(`📨 Message sent in chat ${chatId} by ${senderId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  // Typing indicators
  socket.on('typing', (data) => {
    const { chatId, receiverId, senderName } = data;
    socket.to(`chat-${chatId}`).emit('userTyping', { 
      chatId, 
      senderId: socket.userId,
      senderName,
      status: 'typing'
    });
  });

  socket.on('stopTyping', (data) => {
    const { chatId } = data;
    socket.to(`chat-${chatId}`).emit('userStopTyping', { 
      chatId, 
      senderId: socket.userId 
    });
  });

  // Message read receipt
  socket.on('messageRead', (data) => {
    const { chatId, messageId } = data;
    socket.to(`chat-${chatId}`).emit('messageReadReceipt', { 
      messageId,
      readBy: socket.userId,
      readAt: new Date()
    });
  });

  // ✅ NEW: Blood Request Notifications
  socket.on('newBloodRequest', (data) => {
    const { requestId, bloodGroup, urgency, location } = data;
    
    // Broadcast to all donors with matching blood group
    io.emit('bloodRequestCreated', {
      requestId,
      bloodGroup,
      urgency,
      location,
      timestamp: new Date()
    });
    
    console.log(`🩸 New blood request: ${bloodGroup} - ${urgency}`);
  });

  // ✅ NEW: Request Status Update
  socket.on('requestStatusUpdate', (data) => {
    const { requestId, status, userId } = data;
    
    // Notify specific user
    if (userId) {
      io.to(`user-${userId}`).emit('requestStatusChanged', {
        requestId,
        status,
        timestamp: new Date()
      });
    }
  });

  // ✅ NEW: Donation Confirmation
  socket.on('donationConfirmed', (data) => {
    const { donorId, recipientId, requestId } = data;
    
    // Notify both parties
    if (donorId) {
      io.to(`user-${donorId}`).emit('donationConfirmedNotification', {
        requestId,
        type: 'donor',
        timestamp: new Date()
      });
    }
    
    if (recipientId) {
      io.to(`user-${recipientId}`).emit('donationConfirmedNotification', {
        requestId,
        type: 'recipient',
        timestamp: new Date()
      });
    }
  });

  // ✅ NEW: Hospital Inventory Update
  socket.on('inventoryUpdate', (data) => {
    const { hospitalId, bloodGroup, quantity } = data;
    
    // Broadcast to admins and hospital staff
    io.emit('inventoryChanged', {
      hospitalId,
      bloodGroup,
      quantity,
      timestamp: new Date()
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
        status: 'offline',
        lastSeen: new Date()
      });
      
      console.log(`👋 User ${socket.userId} disconnected`);
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
    socket.emit('errorOccurred', { 
      message: 'An error occurred with your connection',
      timestamp: new Date()
    });
  });
});

// Make io and user maps globally accessible
global.io = io;
global.onlineUsers = onlineUsers;
global.userSockets = userSockets;

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    dbConnection();
});