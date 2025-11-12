import express from "express";
import {
  signup,
  login,
  deleteUser,
  changePassword,
  getMe,
  adminLogin,
  verifyEmail,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  createAdmin,
  getAdmins,
  updateAdminRole,
  deleteAdmin,
} from "../controllers/UserController.js";
import { auth, isOwner } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/admin-login", adminLogin);

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

router.post("/admin/create", auth, isOwner, createAdmin);
router.get("/admins", auth, isOwner, getAdmins);

router.patch("/admin/role/:id", auth, isOwner, updateAdminRole);
router.delete("/admin/:id", auth, isOwner, deleteAdmin);

router.get("/me", auth, getMe);
router.delete("/:id", auth, deleteUser);
router.post("/change-password", auth, changePassword);

export default router;
