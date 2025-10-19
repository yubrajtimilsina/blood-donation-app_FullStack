const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const {
  createChat,
  getUserChats,
  getChat,
  sendMessage,
  markAsRead,
  getUnreadCount,
  deleteChat,
  getRecipientByUserId // ADD THIS
} = require('../controllers/chat');

router.use(verifyToken);

// Create or get chat
router.post('/', createChat);

// Get all user chats
router.get('/', getUserChats);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Get recipient info (for starting chat)
router.get('/recipient/:userId', getRecipientByUserId);

// Get single chat
router.get('/:chatId', getChat);

// Send message
router.post('/:chatId/messages', sendMessage);

// Mark as read
router.put('/:chatId/read', markAsRead);

// Delete chat
router.delete('/:chatId', deleteChat);

module.exports = router;