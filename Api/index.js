import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose
  .connect(process.env.MONGOOSE_CONNECT)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
const app = express();

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
