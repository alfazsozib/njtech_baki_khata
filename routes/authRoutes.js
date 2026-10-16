import express from "express";
import { registerUser, loginUser, getMe } from "server/controllers/authController";
import { protect } from "server/middleware/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post('/login', loginUser);
router.get("/me", protect, getMe);

export default router;