const express = require('express');
const {
    createBloodRequest,
    getAllBloodRequests,
    updateBloodRequestStatus,
    deleteBloodRequest
} = require('../controllers/bloodRequest');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/', createBloodRequest);
router.get('/', getAllBloodRequests);
router.put('/:id', verifyToken, updateBloodRequestStatus);
router.delete('/:id', verifyToken, deleteBloodRequest);

module.exports = router;