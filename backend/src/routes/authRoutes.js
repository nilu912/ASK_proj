import express from "express";
import { registerUser, loginUser, adminLogin } from "../controllers/authController.js";
import verifyToken from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/adminLogin", adminLogin);
router.post("/login", loginUser);
router.get("/verify", verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
