const Notification = require('../models/Notification');

// ✅ ENHANCED: Create notification with Socket.IO
const createNotification = async (userId, notificationData) => {
  try {
    const notification = new Notification({
      userId,
      ...notificationData
    });
    await notification.save();
    
    // ✅ EMIT SOCKET EVENT
    if (global.io) {
      global.io.to(`user-${userId}`).emit('newNotification', {
        notification,
        timestamp: new Date()
      });
    }
    
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    return null;
  }
};

// ✅ NEW: Bulk notification creation
const createBulkNotifications = async (userIds, notificationData) => {
  try {
    const notifications = userIds.map(userId => ({
      userId,
      ...notificationData
    }));
    
    const createdNotifications = await Notification.insertMany(notifications);
    
    // ✅ EMIT TO ALL USERS
    if (global.io) {
      userIds.forEach(userId => {
        global.io.to(`user-${userId}`).emit('newNotification', {
          notification: notificationData,
          timestamp: new Date()
        });
      });
    }
    
    return createdNotifications;
  } catch (error) {
    console.error('Bulk notification error:', error);
    return [];
  }
};

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { read, limit = 50, skip = 0 } = req.query;

    const filter = { userId };
    if (read !== undefined) {
      filter.read = read === 'true';
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const unreadCount = await Notification.countDocuments({ 
      userId, 
      read: false 
    });

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      total: notifications.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// ✅ ENHANCED: Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // ✅ EMIT UPDATE
    if (global.io) {
      global.io.to(`user-${userId}`).emit('notificationRead', {
        notificationId,
        timestamp: new Date()
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

// ✅ ENHANCED: Mark all as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    // ✅ EMIT UPDATE
    if (global.io) {
      global.io.to(`user-${userId}`).emit('allNotificationsRead', {
        count: result.modifiedCount,
        timestamp: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      count: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark all as read',
      error: error.message
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // ✅ EMIT DELETION
    if (global.io) {
      global.io.to(`user-${userId}`).emit('notificationDeleted', {
        notificationId,
        timestamp: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

// ✅ NEW: Clear all notifications
const clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await Notification.deleteMany({ userId });
    
    // ✅ EMIT CLEAR EVENT
    if (global.io) {
      global.io.to(`user-${userId}`).emit('notificationsCleared', {
        count: result.deletedCount,
        timestamp: new Date()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'All notifications cleared',
      count: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear notifications',
      error: error.message
    });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.countDocuments({
      userId,
      read: false
    });

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    });
  }
};

// ✅ NEW: Get notifications by type
const getNotificationsByType = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.params;
    
    const notifications = await Notification.find({
      userId,
      type
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications by type',
      error: error.message
    });
  }
};

module.exports = {
  createNotification,
  createBulkNotifications,  // NEW
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,    // NEW
  getUnreadCount,
  getNotificationsByType    // NEW
};