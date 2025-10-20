const Chat = require('../models/Chat');
const User = require('../models/User');
const Recipient = require('../models/Recipient');

// Store online users (this should be moved to a better place)
const onlineUsers = new Map();

// Create or get existing chat
const createChat = async (req, res) => {
  try {
    const { participantId, relatedTo } = req.body;
    const currentUserId = req.user.id;

    // Check if chat already exists
    let chat = await Chat.findOne({
      'participants.userId': { $all: [currentUserId, participantId] }
    }).populate('participants.userId', 'name email role');

    if (chat) {
      return res.status(200).json({
        success: true,
        data: chat,
        message: 'Chat retrieved successfully'
      });
    }

    // Get participant details
    const [currentUser, participant] = await Promise.all([
      User.findById(currentUserId),
      User.findById(participantId)
    ]);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    // Create new chat
    chat = new Chat({
      participants: [
        { userId: currentUserId, role: currentUser.role },
        { userId: participantId, role: participant.role }
      ],
      relatedTo,
      messages: []
    });

    await chat.save();
    await chat.populate('participants.userId', 'name email role');

    res.status(201).json({
      success: true,
      data: chat,
      message: 'Chat created successfully'
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat',
      error: error.message
    });
  }
};

// Get all chats for current user
const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      'participants.userId': userId
    })
      .populate('participants.userId', 'name email role profileImage')
      .populate('lastMessage.sender', 'name')
      .sort({ 'lastMessage.timestamp': -1 });

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chats',
      error: error.message
    });
  }
};

// Get single chat with messages
const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId)
      .populate('participants.userId', 'name email role profileImage')
      .populate('messages.sender', 'name role');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      p => p.userId._id.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this chat'
      });
    }

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat',
      error: error.message
    });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      p => p.userId.toString() === senderId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to send messages in this chat'
      });
    }

    // Add message
    const message = {
      sender: senderId,
      content: content.trim(),
      timestamp: new Date()
    };

    chat.messages.push(message);
    chat.lastMessage = {
      content: content.trim(),
      timestamp: new Date(),
      sender: senderId
    };

    await chat.save();
    await chat.populate('messages.sender', 'name role');

    res.status(200).json({
      success: true,
      data: chat.messages[chat.messages.length - 1],
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Mark all messages not sent by user as read
    chat.messages.forEach(message => {
      if (message.sender.toString() !== userId) {
        message.read = true;
      }
    });

    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      'participants.userId': userId,
      'messages.sender': { $ne: userId },
      'messages.read': false
    });

    let unreadCount = 0;
    chats.forEach(chat => {
      unreadCount += chat.messages.filter(
        m => m.sender.toString() !== userId && !m.read
      ).length;
    });

    res.status(200).json({
      success: true,
      count: unreadCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    });
  }
};

// Delete chat
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      p => p.userId.toString() === userId
    );

    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this chat'
      });
    }

    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat',
      error: error.message
    });
  }
};

const getRecipientByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const recipient = await Recipient.findOne({ userId }).populate('userId', 'name email role');

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: recipient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipient',
      error: error.message
    });
  }
};

module.exports = {
  createChat,
  getUserChats,
  getChat,
  sendMessage,
  markAsRead,
  getUnreadCount,
  deleteChat,
  getRecipientByUserId
};