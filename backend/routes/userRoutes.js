import express from "express";
import {
  signup,
  login,
  deleteUser,
  changePassword,
  getMe,
  adminLogin,
} from "../controllers/UserController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", auth, getMe);

router.post("/signup", signup);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.delete("/:id", auth, deleteUser);
router.post("/change-password", auth, changePassword);

export default router;
