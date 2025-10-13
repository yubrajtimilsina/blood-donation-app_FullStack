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
  getMyDonorProfile
} = require('../controllers/donor');
const { verifyToken } = require('../middlewares/verifyToken');
const { checkRole } = require('../middlewares/roleCheck');
const router = express.Router();

// 🩸 Public routes
router.get('/search/nearby', searchNearbyDonors);

// 🩸 Add Donor (no token for prospect approval)
router.post('/', createDonor);

// 🩸 Get All Donors
router.get('/', verifyToken, checkRole('admin', 'hospital'), getAlldonors);

// ✅ MOVE THIS UP (before /:id)
router.get('/me', verifyToken, checkRole('donor', 'admin'), getMyDonorProfile);

// 🩸 Stats
router.get('/stats', getDonorsStats);
router.get('/monthly', getDonorsMonthly);

// 🩸 Donation history
router.get('/:donorId/history', verifyToken, getDonationHistory);
router.post('/:donorId/record-donation', verifyToken, checkRole('admin', 'donor'), recordDonation);

// 🩸 Availability toggle
router.put('/:id/availability', verifyToken, checkRole('donor', 'admin'), toggleAvailability);

// 🩸 Get One Donor
router.get('/find/:id', getOneDonor);
router.get('/:id', getOneDonor);

// 🩸 Update Donor
router.put('/:id', verifyToken, updateDonor);

// 🩸 Delete Donor
router.delete('/:id', verifyToken, checkRole('admin'), deleteDonor);

module.exports = router;
