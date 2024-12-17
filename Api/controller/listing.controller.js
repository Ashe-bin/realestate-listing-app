import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete you own listings!"));
  }

  try {
    const deleted = await Listing.findByIdAndDelete(req.params.id);
    if (!deleted) {
      next(errorHandler(404, "failed to delete"));
    }
    res.status(200).json({ deleted, message: "Listing has been deleted!" });
  } catch (error) {
    next(error);
  }
};

export const editListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "listing not found"));
  }

  if (listing.userRef !== req.user.id) {
    return next(errorHandler(404, "you can only update you listing"));
  }
  try {
    const updatedList = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedList);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      next(errorHandler(404, "listing not found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
