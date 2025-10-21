// Backend/routes/admin.js
const express = require('express');
const router = express.Router();
const { verifyToken, verifyTokenAndAuthorization } = require('../middlewares/verifyToken');
const { checkRole } = require('../middlewares/roleCheck');
const {
  getDashboardStats,
  getAllUsers,
  getAllUsersForChat,
  updateUser,
  deleteUser,
  verifyUser,
  getSystemAnalytics,
  getBloodInventoryStatus,
  getDonorsByLocation,
  getRequestFulfillmentRate,
  sendBloodDonationReminders,
  sendMessageToAllRecipients,
  sendMessageToAllDonors
} = require('../controllers/admin');

// All admin routes require admin authentication
router.use(verifyToken);
router.use(checkRole('admin'));

// Dashboard statistics
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/chat', getAllUsersForChat);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);
router.put('/users/:userId/verify', verifyUser);

// System analytics
router.get('/analytics', getSystemAnalytics);
router.get('/analytics/blood-inventory', getBloodInventoryStatus);
router.get('/analytics/donors-location', getDonorsByLocation);
router.get('/analytics/request-fulfillment', getRequestFulfillmentRate);

// Blood donation reminders
router.post('/send-reminders', sendBloodDonationReminders);

// Bulk messaging
router.post('/send-message/recipients', sendMessageToAllRecipients);
router.post('/send-message/donors', sendMessageToAllDonors);

module.exports = router;
