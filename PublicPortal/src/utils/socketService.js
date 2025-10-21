// PublicPortal/src/utils/socketService.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // Connect to Socket.IO server
  connect(userId, role, accessToken) {
    if (this.socket?.connected) {
      console.log('✅ Socket already connected');
      return this.socket;
    }

    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    console.log('🔌 Connecting to Socket.IO server:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      auth: {
        token: accessToken
      }
    });

    this.setupEventListeners(userId, role);
    
    return this.socket;
  }

  setupEventListeners(userId, role) {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.reconnectAttempts = 0;
      
      // Join with user info
      this.socket.emit('join', { userId, role });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      
      if (reason === 'io server disconnect') {
        // Server forcefully disconnected, try to reconnect
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('⚠️ Socket connection error:', error.message);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('❌ Max reconnection attempts reached');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      this.socket.emit('join', { userId, role });
    });

    // User status updates
    this.socket.on('userOnline', (data) => {
      console.log('👤 User online:', data.userId);
    });

    this.socket.on('userOffline', (data) => {
      console.log('👋 User offline:', data.userId);
    });

    // Online users list
    this.socket.on('onlineUsers', (users) => {
      console.log('📋 Online users:', users.length);
    });

    // Error handling
    this.socket.on('errorOccurred', (data) => {
      console.error('❌ Socket error:', data.message);
    });
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      this.reconnectAttempts = 0;
      console.log('🔌 Socket disconnected manually');
    }
  }

  // Register event listener
  on(event, callback) {
    if (!this.socket) {
      console.error('❌ Socket not connected');
      return;
    }

    this.socket.on(event, callback);
    
    // Store for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (!this.socket) return;

    this.socket.off(event, callback);
    
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit event
  emit(event, data) {
    if (!this.socket || !this.socket.connected) {
      console.error('❌ Socket not connected, cannot emit:', event);
      return false;
    }

    this.socket.emit(event, data);
    return true;
  }

  // ==================== CHAT METHODS ====================
  
  joinChat(chatId) {
    console.log('📌 Joining chat:', chatId);
    return this.emit('joinChat', chatId);
  }

  leaveChat(chatId) {
    console.log('👋 Leaving chat:', chatId);
    return this.emit('leaveChat', chatId);
  }

  sendMessage(chatId, content, senderId, receiverId) {
    console.log('📨 Sending message in chat:', chatId);
    return this.emit('sendMessage', {
      chatId,
      message: { content },
      senderId,
      receiverId,
      timestamp: new Date()
    });
  }

  startTyping(chatId, receiverId, senderName) {
    return this.emit('typing', { chatId, receiverId, senderName });
  }

  stopTyping(chatId, receiverId) {
    return this.emit('stopTyping', { chatId, receiverId });
  }

  markMessageAsRead(chatId, messageId) {
    return this.emit('messageRead', { chatId, messageId });
  }

  // ==================== BLOOD REQUEST METHODS ====================
  
  notifyNewBloodRequest(requestId, bloodGroup, urgency, location) {
    console.log('🩸 Notifying new blood request:', requestId);
    return this.emit('newBloodRequest', {
      requestId,
      bloodGroup,
      urgency,
      location
    });
  }

  notifyRequestStatusUpdate(requestId, status, userId) {
    return this.emit('requestStatusUpdate', {
      requestId,
      status,
      userId
    });
  }

  notifyDonationConfirmed(donorId, recipientId, requestId) {
    return this.emit('donationConfirmed', {
      donorId,
      recipientId,
      requestId
    });
  }

  // ==================== HOSPITAL METHODS ====================
  
  notifyInventoryUpdate(hospitalId, bloodGroup, quantity) {
    return this.emit('inventoryUpdate', {
      hospitalId,
      bloodGroup,
      quantity
    });
  }

  // ==================== UTILITY METHODS ====================
  
  isConnected() {
    return this.socket?.connected || false;
  }

  getSocketId() {
    return this.socket?.id || null;
  }

  getSocket() {
    return this.socket;
  }
}

// Create singleton instance
export const socketService = new SocketService();

