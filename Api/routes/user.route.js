import express from "express";
import {
  deleteUser,
  profileUpdate,
  test,
  getUserListings,
} from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, profileUpdate);
router.delete("/delete-user/:id", verifyToken, deleteUser);
router.get("/listing/:id", verifyToken, getUserListings);
export default router;
