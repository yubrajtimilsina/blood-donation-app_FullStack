const express = require('express');
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notification');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();

// Get user notifications
router.get('/', verifyToken, getUserNotifications);

// Get unread count
router.get('/unread-count', verifyToken, getUnreadCount);

// Mark notification as read
router.put('/:id/read', verifyToken, markAsRead);

// Mark all as read
router.put('/read-all', verifyToken, markAllAsRead);

// Delete notification
router.delete('/:id', verifyToken, deleteNotification);

module.exports = router;
