const express = require('express');
const { createProspect, getAllProspects, updateProspect, getOneProspect, deleteProspect } = require('../controllers/prospect');
const router = express.Router();

//Add Prospect
router.post('/',createProspect);
//Get All Prospects
router.get('/',getAllProspects);
//Get One Prospect
router.get('/find/:id',getOneProspect);

//Update Prospect
router.put('/:id',updateProspect);
//Delete Prospect
router.delete('/:id',deleteProspect);

module.exports = router;
