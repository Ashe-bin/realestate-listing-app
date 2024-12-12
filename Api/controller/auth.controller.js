import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User create successfully");
  } catch (error) {
    next(error);
  }
};
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const isValidUser = await User.findOne({ email });
    if (!isValidUser) {
      next(errorHandler(404, "user not found!"));
    }
    const isValidPassword = bcryptjs.compareSync(
      password,
      isValidUser.password
    );
    if (!isValidPassword) {
      return next(errorHandler(404, "Wrong credential"));
    }
    const token = jwt.sign({ id: isValidUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = isValidUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
