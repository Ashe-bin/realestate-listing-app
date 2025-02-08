import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaBath, FaBed, FaHeart } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { AiFillDollarCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";

import {
  updateCurrentUser,
  updateCurrentUserStart,
} from "@/redux/feature/user/userSlice";

import { addLiked, removeLiked } from "@/redux/feature/user/userLikedListSlice";
import LazyLoads from "./LazyLoads";
import toast from "react-hot-toast";
const ListingItem = ({ listing }) => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLike = async (list) => {
    if (!currentUser) {
      toast.error("Please sign in first, to be able to like listing");
      return;
    }
    let likedExist = currentUser?.liked?.includes(list._id);

    if (likedExist) {
      dispatch(removeLiked(list._id));
    } else {
      dispatch(addLiked(list));
    }

    dispatch(updateCurrentUserStart());
    try {
      const res = await fetch(`/api/user/liked/${currentUser?._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify({ id: list._id }),
      });

      const data = await res.json();
      if (data.success === false) {
        console.error(`error occurred, ${data}`);
        return;
      }

      dispatch(updateCurrentUser(data));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="relative bg-white shadow-sm shadow-[#c0fdfb] hover:shadow-lg hover:shadow-gray-300 transition-shadow overflow-hidden rounded-lg w-[90%] mx-auto sm:w-[330px] border border-black/30 text-left ">
      <p className="absolute rounded-bl-md text-white top-0 right-0 px-1 z-10  bg-[#64b6ac] ">
        {listing.type}
      </p>
      {currentUser?._id === listing?.userRef && (
        <p className="absolute rounded-br-md text-white top-0 left-0 px-1 z-10  bg-[#64b6ac] ">
          your own listing
        </p>
      )}
      <div className="relative overflow-clip">
        <Link to={`/listing/${listing._id}`}>
          <LazyLoads
            src={listing.imageURLS[0]}
            alt="listing cover"
            className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
          />
        </Link>
        {currentUser?._id !== listing?.userRef &&
          (currentUser?.liked?.includes(listing?._id) ? (
            <div
              className={`z-10 flex justify-center items-center absolute bottom-5 right-5 border border-black/60 p-2 rounded-full bg-teal-400 active:bg-[#c0fdfb]   ${
                loading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => handleLike(listing)}
            >
              <FaHeart className=" size-5 text-red-800  " />
            </div>
          ) : (
            <div
              className={`z-10 flex justify-center items-center absolute bottom-5 right-5 border border-black/60 p-2 rounded-full bg-teal-400 active:bg-[#c0fdfb]  ${
                loading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => handleLike(listing)}
            >
              <FaHeart className=" size-5 text-white " />
            </div>
          ))}
      </div>
      <Link to={`/listing/${listing._id}`}>
        <div className="px-3 pb-3  flex flex-col gap-3 w-full text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-zinc-500 to-yellow-800">
          <p className="truncate text-wrap sm:text-nowrap text-sm bg-clip-text bg-gradient-to-r from-teal-700  to-yellow-700 ">
            {listing.propertyType}
          </p>
          <div className="flex gap-3 items-center ">
            <IoHome className="size-5  text-[#64b6ac]" />
            <p className="truncate text-wrap sm:text-nowrap sm:text-lg sm:font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-700  to-yellow-700">
              {listing.name}
            </p>
          </div>
          <div className="flex gap-3 items-center  ">
            <MdLocationOn className="size-5 text-[#64b6ac] " />
            <p className="text-sm  truncate w-full italic">{listing.address}</p>
          </div>
          <p className="text-md   line-clamp-2  ">{listing.description}</p>
          <div className="flex gap-3  items-center  ">
            <AiFillDollarCircle className="size-5 text-[#64b6ac]" />
            <p className="  font-normal">
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
          </div>

          <div className=" flex gap-8">
            <div className="font-normal text-md flex gap-1  items-center ">
              <FaBed className="size-5 text-[#64b6ac]" />
              {`${listing?.bedRoom} bed`}
            </div>
            <div className="font-normal    text-md flex items-center gap-1">
              <FaBath className="size-5 text-[#64b6ac]" />
              {`${listing?.bathRoom} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
