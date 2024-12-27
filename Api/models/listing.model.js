import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    regularPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    bathRoom: { type: Number, required: true },
    bedRoom: { type: Number, required: true },
    furnished: { type: Boolean, required: true },
    parking: { type: Boolean, required: true },
    type: { type: String, required: true },
    offer: { type: Boolean, required: true },
    imageURLS: [{ type: String, required: true }],
    userRef: { type: String, required: true },
    propertyType: { type: String },
    propertyDetail: { type: String },
    houseArea: { type: Number, required: true },
    lotArea: { type: Number, required: true },
    developedDate: { type: Date },
  },
  { timestamps: true }
);
const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
