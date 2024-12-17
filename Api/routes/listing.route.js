import express from "express";
import {
  createListing,
  deleteListing,
  editListing,
  getListing,
} from "../controller/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/edit/:id", verifyToken, editListing);
router.get("/getListing/:id", getListing);
export default router;
