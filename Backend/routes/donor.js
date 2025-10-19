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

// Advanced donor search
router.get('/search/advanced', verifyToken, async (req, res) => {
  try {
    const { bloodgroup, isAvailable, age, weight, location } = req.query;
    
    const filter = {};
    if (bloodgroup) filter.bloodgroup = bloodgroup;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';
    if (age) filter.age = { $gte: parseInt(age) };
    if (weight) filter.weight = { $gte: parseInt(weight) };

    const donors = await Donor.find(filter)
      .populate('userId', 'name email verified')
      .limit(100);

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search donors',
      error: error.message
    });
  }
});

module.exports = router;