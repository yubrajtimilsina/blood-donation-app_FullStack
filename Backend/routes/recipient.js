const express = require('express');
const {
  createRecipientProfile,
  getRecipientProfile,
  updateRecipientProfile,
  getAllRecipients,
  verifyRecipient,
  getMyRecipientProfile,
} = require('../controllers/recipient');
const { verifyToken } = require('../middlewares/verifyToken');
const { checkRole } = require('../middlewares/roleCheck');
const router = express.Router();

// Create recipient profile
router.post('/profile', verifyToken, checkRole('recipient', 'admin'), createRecipientProfile);

// Get recipient profile (current user or by ID)
router.get('/profile', verifyToken, getRecipientProfile);
router.get('/profile/:userId', verifyToken, getRecipientProfile);

router.get('/me/profile', verifyToken, checkRole('recipient', 'admin'), getMyRecipientProfile);

// Update recipient profile
router.put('/profile', verifyToken, checkRole('recipient', 'admin'), updateRecipientProfile);

// Get all recipients (admin only)
router.get('/', verifyToken, checkRole('admin'), getAllRecipients);

// Verify recipient (admin only)
router.put('/:recipientId/verify', verifyToken, checkRole('admin'), verifyRecipient);

module.exports = router;
