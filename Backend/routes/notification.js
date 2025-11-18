const express = require('express');
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,      // NEW
  getUnreadCount,
  getNotificationsByType      // NEW
} = require('../controllers/notification');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();

router.use(verifyToken);

// Get user notifications
router.get('/', getUserNotifications);

// Mark notification as read
router.put('/:notificationId/read', markAsRead);

// Mark all as read
router.put('/read-all', markAllAsRead);

// Delete notification
router.delete('/:notificationId', deleteNotification);

// Get unread count (after param routes to avoid conflicts)
router.get('/unread-count', getUnreadCount);

// Get notifications by type (after param routes to avoid conflicts)
router.get('/type/:type', getNotificationsByType);

// Clear all notifications
router.delete('/clear-all', clearAllNotifications);

module.exports = router;