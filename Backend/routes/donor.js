const express = require('express');
const router = express.Router();

//Add Donor
router.post('/',createDonor);

//Get All Donors
router.get('/',getAlldonors);

//Get One Donor
router.get('/find/:id',getOneDonor);

//Update Donor
router.put('/:id',updateDonor);

//Delete Donor
router.delete('/:id',deleteDonor);

//Get Donor Statistics
router.get('/stats',getDonorsStats);

module.exports = router;