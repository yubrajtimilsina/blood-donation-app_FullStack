const router = require("express").Router();
const { verifyToken } = require("../middlewares/verifyToken");
const { checkRole } = require("../middlewares/roleCheck");
const {
  getHospitalProfile,
  updateHospitalProfile,
  updateBloodInventory,
  getBloodInventory,
  getAllHospitals,
  getLocalDonors,
  getHospitalRequests
} = require("../controllers/hospital");

// Hospital profile routes
router.get("/profile", verifyToken, checkRole('hospital', 'admin'), getHospitalProfile);
router.put("/profile", verifyToken, checkRole('hospital', 'admin'), updateHospitalProfile);

// Blood inventory routes
router.get("/inventory", verifyToken, checkRole('hospital', 'admin'), getBloodInventory);
router.put("/inventory", verifyToken, checkRole('hospital', 'admin'), updateBloodInventory);

// Hospital donors route
router.get("/local-donors", verifyToken, checkRole('hospital', 'admin'), getLocalDonors);

// Hospital requests route
router.get("/requests", verifyToken, checkRole('hospital', 'admin'), getHospitalRequests);

// Admin routes
router.get("/all", verifyToken, checkRole('admin'), getAllHospitals);

module.exports = router;