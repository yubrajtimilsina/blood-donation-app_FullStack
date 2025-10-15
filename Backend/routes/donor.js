const express = require('express');
const {
  createDonor,
  getAlldonors,
  updateDonor,
  getOneDonor,
  deleteDonor,
  getDonorsStats,
  getDonorsMonthly,
  toggleAvailability,
  searchNearbyDonors,
  recordDonation,
  getDonationHistory,
  getMyDonorProfile  // ✅ Import this
} = require('../controllers/donor');
const { verifyToken } = require('../middlewares/verifyToken');
const { checkRole } = require('../middlewares/roleCheck');
const router = express.Router();

// 🩸 Public routes
router.get('/search/nearby', searchNearbyDonors);
router.get('/public', getAlldonors); // Public route to get all donors
router.post('/', createDonor);

// ⚠️ CRITICAL: This MUST be BEFORE /:id routes
router.get('/me', verifyToken, checkRole('donor', 'admin'), getMyDonorProfile);

// 🩸 Protected routes
router.get('/', verifyToken, checkRole('admin', 'hospital'), getAlldonors);
router.get('/stats', getDonorsStats);
router.get('/monthly', getDonorsMonthly);
router.get('/:donorId/history', verifyToken, getDonationHistory);
router.post('/:donorId/record-donation', verifyToken, checkRole('admin', 'donor'), recordDonation);
router.put('/:id/availability', verifyToken, checkRole('donor', 'admin'), toggleAvailability);
router.get('/find/:id', getOneDonor);
router.get('/:id', getOneDonor);
router.put('/:id', verifyToken, updateDonor);
router.delete('/:id', verifyToken, checkRole('admin'), deleteDonor);

module.exports = router;