const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  getAdmins,
  deleteAdmin,
  changePassword,
} = require("../controllers/authController");

const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);

router.post("/register", protect, requireRole("president"), registerAdmin);

router.get("/admins", protect, requireRole("president"), getAdmins);

router.delete("/admins/:id", protect, requireRole("president"), deleteAdmin);

router.put("/change-password", protect, changePassword);

module.exports = router;