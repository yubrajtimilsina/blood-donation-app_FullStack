// CORRECTED ORDER:
const express = require('express');
const { 
  createProspect, 
  getAllProspects, 
  updateProspect, 
  getOneProspect, 
  deleteProspect, 
  getProspectsMonthly 
} = require('../controllers/prospect');
const router = express.Router();

router.post('/', createProspect);

// ✅ SPECIFIC ROUTES FIRST
router.get('/monthly', getProspectsMonthly);
router.get('/find/:id', getOneProspect);

// ✅ GENERIC ROUTES AFTER
router.get('/', getAllProspects);
router.put('/:id', updateProspect);
router.delete('/:id', deleteProspect);

module.exports = router;