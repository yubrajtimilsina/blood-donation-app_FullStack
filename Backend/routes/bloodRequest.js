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

// Create blood request (recipients, hospitals and admin)
router.post('/', verifyToken, checkRole('recipient', 'hospital', 'admin'), createBloodRequest);

// Get all blood requests
router.get('/', getAllBloodRequests);

// Get nearby requests for donor
router.get('/nearby', verifyToken, checkRole('donor', 'admin'), getNearbyRequests);

// Get single blood request
router.get('/:id', getBloodRequest);

// Update blood request status
router.put('/:id', verifyToken, updateBloodRequestStatus);

// Delete blood request (admin only)
router.delete('/:id', verifyToken, checkRole('admin'), deleteBloodRequest);

module.exports = router;