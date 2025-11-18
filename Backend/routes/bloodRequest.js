const express = require('express');
const {
    createBloodRequest,
    getAllBloodRequests,
    getNearbyRequests,
    getBloodRequest,
    updateBloodRequestStatus,
    deleteBloodRequest
} = require('../controllers/bloodRequest');
const { verifyToken } = require('../middlewares/verifyToken');
const { checkRole } = require('../middlewares/roleCheck');
const router = express.Router();

// Create blood request
router.post('/', verifyToken, checkRole('recipient', 'hospital', 'admin'), createBloodRequest);

// Get nearby requests for donor (SPECIFIC)
router.get('/nearby', verifyToken, checkRole('donor', 'admin'), getNearbyRequests);

// Get all blood requests (GENERIC)
router.get('/', getAllBloodRequests);

//router.post('/:id/respond', verifyToken, respondToBloodRequest);

// Get single blood request
router.get('/:id', getBloodRequest);

// Update blood request status
router.put('/:id', verifyToken, updateBloodRequestStatus);

// Delete blood request
router.delete('/:id', verifyToken, checkRole('admin'), deleteBloodRequest);


// Search blood requests with filters
router.get('/search', verifyToken, async (req, res) => {
    try {
      const { status, bloodGroup, urgency, location, radius = 50 } = req.query;
      
      const filter = {};
      if (status) filter.status = status;
      if (bloodGroup) filter.bloodGroup = bloodGroup;
      if (urgency) filter.urgency = urgency;
  
      const requests = await BloodRequest.find(filter)
        .populate('createdBy', 'name email phone')
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to search requests',
        error: error.message
      });
    }
  });

  
module.exports = router;