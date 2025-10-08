// Backend/routes/admin.js
const express = require('express');
const router = express.Router();
const { verifyToken, verifyTokenAndAuthorization } = require('../middlewares/verifyToken');
const { checkRole } = require('../middlewares/roleCheck');
const {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  verifyUser,
  getSystemAnalytics
} = require('../controllers/admin');

// All admin routes require admin authentication
router.use(verifyToken);
router.use(checkRole('admin'));

// Dashboard statistics
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);
router.put('/users/:userId/verify', verifyUser);

// System analytics
router.get('/analytics', getSystemAnalytics);

module.exports = router;