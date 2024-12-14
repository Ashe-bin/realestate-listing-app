import express from "express";
import {
  deleteUser,
  profileUpdate,
  test,
} from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, profileUpdate);
router.post("/delete-user/:id", verifyToken, deleteUser);
export default router;
