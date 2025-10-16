import express from "express";
import { signup, login, deleteUser, changePassword } from "../controllers/UserController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/:id", auth, deleteUser);
router.post("/change-password", auth, changePassword);

export default router;
