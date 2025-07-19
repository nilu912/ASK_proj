import express from "express";
import { getUsers, setUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
// router.post("/register", setUsers);

export default router;
