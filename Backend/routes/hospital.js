const router = require("express").Router();
const { verifyToken, verifyRole } = require("../middleware/verifyToken");
const {
  getHospitalProfile,
  updateHospitalProfile,
  updateBloodInventory,
  getBloodInventory,
  getAllHospitals
} = require("../controllers/hospital");

// Hospital profile routes
router.get("/profile", verifyToken, verifyRole(['hospital']), getHospitalProfile);
router.put("/profile", verifyToken, verifyRole(['hospital']), updateHospitalProfile);

// Blood inventory routes
router.get("/inventory", verifyToken, verifyRole(['hospital']), getBloodInventory);
router.put("/inventory", verifyToken, verifyRole(['hospital']), updateBloodInventory);

// Admin routes
router.get("/all", verifyToken, verifyRole(['admin']), getAllHospitals);

module.exports = router;
