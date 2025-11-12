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
} from "../controllers/UserController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/admin-login", adminLogin);

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

router.get("/me", auth, getMe);
router.delete("/:id", auth, deleteUser);
router.post("/change-password", auth, changePassword);

export default router;
