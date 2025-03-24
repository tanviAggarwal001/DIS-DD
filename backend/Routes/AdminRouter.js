const express = require("express");
const { adminLoginValidation, adminRegisterValidation } = require("../Middlewares/AdminMiddleware");
const { adminLogin, registerAdmin, getAllAdmins } = require("../Controllers/AdminController");
const { verifyAdminToken, verifySuperAdmin } = require("../Middlewares/AuthMiddleware");

const router = express.Router();

// Admin authentication routes
router.post("/login", adminLoginValidation, adminLogin);
router.post("/register", adminRegisterValidation, registerAdmin);

// Protected admin routes
router.get("/all", verifyAdminToken, verifySuperAdmin, getAllAdmins);

module.exports = router;