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
const ListingItem = ({ listing }) => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLike = async (list) => {
    let likedExist = currentUser?.liked?.includes(list._id);

    if (likedExist) {
      dispatch(removeLiked(list._id));
    } else {
      dispatch(addLiked(list));
    }

    dispatch(updateCurrentUserStart());
    try {
      const res = await fetch(`/api/user/liked/${currentUser._id}`, {
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
    <div className="relative bg-white shadow-md shadow-gray-[#c0fdfb] hover:shadow-lg hover:shadow-gray-300 transition-shadow overflow-hidden rounded-lg w-[95%] mx-auto sm:w-[330px] border border-black/20 text-left">
      <p className="absolute rounded-bl-md text-white top-0 right-0 px-1 z-10  bg-[#64b6ac] ">
        {listing.type}
      </p>
      <div className="relative overflow-clip">
        <Link to={`/listing/${listing._id}`}>
          <img
            src={listing.imageURLS[0]}
            alt="listing cover"
            className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
          />
        </Link>
        {currentUser?.liked?.includes(listing._id) ? (
          <div
            className={`z-10 flex justify-center items-center absolute bottom-5 right-5 border border-black/60 p-2 rounded-full bg-[#f5ebe0] active:bg-[#c0fdfb]   ${
              loading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => handleLike(listing)}
          >
            <FaHeart className=" size-6 text-red-800  " />
          </div>
        ) : (
          <div
            className={`z-10 flex justify-center items-center absolute bottom-5 right-5 border border-black/60 p-2 rounded-full bg-[#f5ebe0] active:bg-[#c0fdfb]  ${
              loading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => handleLike(listing)}
          >
            <FaHeart className=" size-6 text-black/70 " />
          </div>
        )}
      </div>
      <Link to={`/listing/${listing._id}`}>
        <div className="p-3 flex flex-col gap-2 w-full">
          <div className="flex items-center gap-1">
            <IoHome className="size-4 text-[#64b6ac]" />
            <p className="truncate text-wrap sm:text-nowrap sm:text-lg sm:font-semibold text-slate-700">
              {listing.name}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-[#64b6ac] " />
            <p className="text-sm text-gray-600 truncate w-ful italic">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <div className="flex  items-center gap-1 mt-2">
            <AiFillDollarCircle className="h-4 w-4 text-[#64b6ac]" />

            <p className="text-slate-500  font-semibold">
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
          </div>

          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs flex items-center gap-1">
              <FaBed className="h-4 w-4 text-[#64b6ac]" />
              {`${listing?.bedRoom} bed`}
            </div>
            <div className="font-bold text-xs flex items-center gap-1">
              <FaBath className="h-4 w-4 text-[#64b6ac]" />
              {`${listing?.bathRoom} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
