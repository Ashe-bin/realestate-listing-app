import Container from "@/components/Container";
import ListingItem from "@/components/ListingItem";
import { ListingItemSkeleton } from "@/components/Skeleton";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoHome } from "react-icons/io5";
import { MdLocationOn } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TbFaceIdError } from "react-icons/tb";
import { BsFillChatHeartFill } from "react-icons/bs";
import { TbHomeSearch } from "react-icons/tb";
import AlertModal from "@/components/AlertModal";

const ShowListing = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [userListing, setUserListing] = useState([]);
  const [showListError, setShowListError] = useState(false);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [listingId, setListingId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { liked } = useSelector((state) => state.userLiked);
  const location = useLocation();
  const savedListRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleShowListing = async () => {
      setShowListError(false);
      try {
        const res = await fetch(`/api/user/listing/${currentUser._id}`);

        const data = await res.json();

        if (data.success === false) {
          console.error(`show listing error ${data}`);
          setShowListError(true);
          return;
        }

        setUserListing(data);
      } catch (error) {
        console.error(`show listing error ${error.message}`);
        setShowListError(true);
      } finally {
        setIsPageLoading(false);
      }
    };
    handleShowListing();
  }, [currentUser]);

  useEffect(() => {
    if (location.hash === "#saved-listing" && savedListRef.current) {
      const offset = 150;
      const elementPosition = savedListRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [location]);

  const handleDeleteList = (id) => {
    setListingId(id);
    setIsAlertModalOpen(true);
  };

  const confirmDeleteListing = async (confirm) => {
    if (confirm) {
      try {
        const res = await fetch(`/api/listing/delete/${listingId}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (data.success === false) {
          console.error(`error deleting  ${data}`);
          toast.error("Could not delete listing, please try again");
          setIsAlertModalOpen(false);
          return;
        }
        toast.success("Listing deleted successfully");

        setUserListing((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
      } catch (error) {
        console.error(error.message);
        toast.error("Could not delete listing, please try again");
      }
    }
    setIsAlertModalOpen(false);
  };
  return (
    <>
      <Container>
        <div className="flex my-5">
          <h1 className="inline-block text-xl   sm:font-semibold md:text-2xl lg:text-4xl   rounded-xl  py-2 px-4 shadow-inner  shadow-[#155e75]/50  text-[#155e75] capitalize mx-auto ">
            Your Listings
          </h1>
        </div>
        {isPageLoading && (
          <div className="flex flex-col gap-4   my-10  ">
            <div className="grid  md:grid-cols-2  xl:grid-cols-3  gap-5 ">
              {Array.from({ length: 3 }, (_, index) => (
                <ListingItemSkeleton key={index} />
              ))}
            </div>
          </div>
        )}
        {showListError && (
          <div className="flex flex-col gap-4 items-center justify-center h-[50%] py-10 text-center px-4">
            <TbFaceIdError className="w-24 h-24 text-slate-700 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">
              Its Our bad, Could not fetch your Listing
            </h2>
            <p className="text-muted-foreground text-lg">
              Go back to home page and try again
            </p>
            <button
              className="border border-black/60 capitalize bg-[#c0fdfb] py-1 px-4  rounded-md hover:bg-[#d8e2dc] active:bg-[#c0fdfb] text-lg font-semibold text-slate-700"
              onClick={() => {
                navigate("/");
              }}
            >
              Back To Home
            </button>{" "}
          </div>
        )}
        {!isPageLoading && !showListError && userListing.length > 0 ? (
          <div className="flex flex-col gap-4   my-10  ">
            <div className="grid  md:grid-cols-2  xl:grid-cols-3  gap-5 ">
              {userListing.map((listing) => (
                <div
                  key={listing._id}
                  className=" relative bg-white shadow-md shadow-gray-[#c0fdfb] hover:shadow-lg hover:shadow-gray-300 transition-shadow overflow-hidden rounded-lg w-[95%] mx-auto sm:w-[330px] border border-black/20 text-left   "
                >
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      src={listing.imageURLS[0]}
                      alt="listing cover"
                      className="  h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
                    />
                  </Link>

                  <div className="p-3 flex flex-col gap-2 w-full">
                    <Link to={`/listing/${listing._id}`}>
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
                    </Link>

                    <div className="flex md:flex-col  items-center gap-4 p-4">
                      <button
                        className="border border-black/60 capitalize bg-red-500 py-1 px-4  rounded-md hover:bg-red-400 active:bg-[#c0fdfb]"
                        onClick={() => handleDeleteList(listing._id)}
                      >
                        {" "}
                        Delete
                      </button>
                      <Link to={`/edit-listing/${listing._id}`}>
                        <button className="border border-black/60 capitalize bg-[#c0fdfb] py-1 px-4  rounded-md hover:bg-[#d8e2dc] active:bg-[#c0fdfb]">
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex   border-black/30  flex-col items-center justify-center py-10 h-[50%] text-center px-4">
            <TbHomeSearch className="w-24 h-24 text-muted-foreground mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">
              Seems there no listing you created
            </h2>
            <p className="text-muted-foreground">
              If you created listing, you will find it here!
            </p>
          </div>
        )}
        <div className="flex my-10">
          <h1 className="inline-block text-xl   sm:font-semibold md:text-2xl lg:text-4xl   rounded-xl  py-2 px-4 shadow-inner  shadow-[#ef4444]/50  text-[#7f1d1d]  capitalize mx-auto ">
            Saved Listing
          </h1>
        </div>
        {isPageLoading && (
          <div className="flex flex-col gap-4   my-10  ">
            <div className="grid  md:grid-cols-2  xl:grid-cols-3  gap-5 ">
              {Array.from({ length: 3 }, (_, index) => (
                <ListingItemSkeleton key={index} />
              ))}
            </div>
          </div>
        )}
        {liked.length > 0 ? (
          !isPageLoading && (
            <div id="saved-listing" className="my-5 mx-auto" ref={savedListRef}>
              <div className="grid  md:grid-cols-2  xl:grid-cols-3  gap-5 ">
                {" "}
                {liked.map((list) => (
                  <ListingItem listing={list} key={list._id} />
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-[50%] text-center py-10 px-4">
            <BsFillChatHeartFill className="w-24 h-24 text-muted-foreground mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold mb-2 text-slate-700">
              Seems there is no listing you liked!
            </h2>
            <p className="text-muted-foreground text-lg">
              If you liked listing that you wanted to check later, you will find
              it here!
            </p>
          </div>
        )}
      </Container>
      <AlertModal
        isAlertModalOpen={isAlertModalOpen}
        confirmDeleteImg={confirmDeleteListing}
        setIsAlertModalOpen={setIsAlertModalOpen}
        message={`This action cannot be undone. Listing will be deleted permanently.`}
      />
    </>
  );
};

export default ShowListing;
