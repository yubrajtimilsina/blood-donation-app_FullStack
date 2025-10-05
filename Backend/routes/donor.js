// Backend/routes/donor.js - REPLACE ENTIRE CONTENT
const express = require('express');
const { createDonor, getAlldonors, updateDonor, getOneDonor, deleteDonor, getDonorsStats } = require('../controllers/donor');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();

//Add Donor - Remove verifyToken for prospect approval
router.post('/', createDonor);  // REMOVED verifyToken

//Get All Donors
router.get('/', getAlldonors);

//Get Donor Statistics (place BEFORE param routes to avoid conflicts)
router.get('/stats', getDonorsStats);

//Get One Donor (support both /find/:id and /:id)
router.get('/find/:id', getOneDonor);
router.get('/:id', getOneDonor);

//Update Donor - Add verifyToken for security
router.put('/:id', verifyToken, updateDonor);

//Delete Donor - Add verifyToken for security
router.delete('/:id', verifyToken, deleteDonor);

module.exports = router;