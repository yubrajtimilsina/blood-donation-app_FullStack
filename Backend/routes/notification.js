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

// Get unread count
router.get('/unread-count', getUnreadCount);

// Get notifications by type
router.get('/type/:type', getNotificationsByType);  // NEW

// Mark notification as read
router.put('/:notificationId/read', markAsRead);

// Mark all as read
router.put('/read-all', markAllAsRead);

// Clear all notifications
router.delete('/clear-all', clearAllNotifications);  // NEW

// Delete notification
router.delete('/:notificationId', deleteNotification);

module.exports = router;