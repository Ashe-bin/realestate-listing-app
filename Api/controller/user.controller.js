import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
export const test = (req, res) => {
  res.json({
    message: "test api route",
  });
};

export const profileUpdate = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete you own account"));
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "user not found" });
    }
    res.clearCookie("access_token", { httpOnly: true, sameSite: "strict" });
    res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view you own listings!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(errorHandler(404, "user not found!"));
    }

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
export const addRemoveFromFavorite = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return errorHandler(401, "You can only add favorites to your account !");
    }

    const userData = await User.findById(req.params.id);
    if (!userData) {
      return next(errorHandler(404, "user not found"));
    }
    const listingId = req.body.id;

    const isLiked = userData.liked.includes(listingId);
    let updatedUser;
    if (isLiked) {
      updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { liked: listingId },
        },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $push: { liked: listingId },
        },
        { new: true }
      );
    }
    const { password: pass, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
