import express from "express";
import { signup, login, deleteUser } from "../controllers/UserController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/:id", auth, deleteUser);

export default router;
