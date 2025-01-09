import express from "express";
import {
  googleAuth,
  signin,
  signout,
  signup,
  checkAccessToken,
} from "../controller/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuth);
router.get("/signout", signout);
router.get("/accessTokenExist", verifyToken, checkAccessToken);
export default router;
