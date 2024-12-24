import Container from "@/components/Container";
import ListingItem from "@/components/ListingItem";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const ShowListing = () => {
  const [userListing, setUserListing] = useState([]);
  const [showListError, setShowListError] = useState(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const { liked } = useSelector((state) => state.userLiked);
  const location = useLocation();
  const savedListRef = useRef();
  useEffect(() => {
    const handleShowListing = async () => {
      setShowListError(null);
      try {
        const res = await fetch(`/api/user/listing/${currentUser._id}`);

        const data = await res.json();

        if (data.success === false) {
          setShowListError(
            "Could not fetch user listing data, please try again"
          );
          return;
        }

        setUserListing(data);
      } catch (error) {
        console.error(error.message);
        setShowListError(
          "failed, to fetch user listing data, please try again!"
        );
      }
    };
    handleShowListing();
  }, [currentUser]);

  useEffect(() => {
    setTimeout(() => {
      if (location.hash === "#saved-listing" && savedListRef.current) {
        const offset = 150;
        const elementPosition =
          savedListRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 1000);
  }, [location]);

  const handleDeleteList = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        console.error(`error deleting  ${data}`);
        return;
      }

      setUserListing((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <>
      <Container>
        {userListing.length > 0 && (
          <div className="flex flex-col gap-4   my-10 max-w-[80%] mx-auto">
            <h1 className="text-center mt-7 text-2xl font-mono">
              Your Listings
            </h1>
            {userListing.map((listing) => (
              <div
                key={listing._id}
                className=" border text-lg font-semibold border-black/60 rounded-lg overflow-clip  flex flex-col md:flex-row  justify-between items-center gap-4 flex-wrap  "
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageURLS[0]}
                    alt="listing cover"
                    className="md:h-52  mx-auto h-auto w-full md:w-52  object-fill"
                  />
                </Link>
                <Link
                  to={`/listing/${listing._id}`}
                  className="text-slate-700 flex-1 hover:underline truncate"
                >
                  <p>{listing.name}</p>
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
            ))}
          </div>
        )}
        {liked.length > 0 && (
          <div id="saved-listing" className="my-5 mx-auto" ref={savedListRef}>
            <h1 className="text-center mt-7 text-2xl font-mono">
              Saved Listings
            </h1>
            <div className="my-5">
              <div className="flex flex-wrap gap-4">
                {liked.map((list) => (
                  <ListingItem listing={list} key={list._id} />
                ))}
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default ShowListing;
