import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { FaSearch } from "react-icons/fa";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { setLiked } from "@/redux/feature/user/userLikedListSlice";

export const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const { liked } = useSelector((state) => state.userLiked);
  SwiperCore.use([Navigation]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/getListing?offer=true&limit=4`);
        const data = await res.json();
        if (data.success === false) {
          console.log("error fetching data", data);
        }
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log("error", error.message);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/getListing?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log("error", error.message);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/getListing?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log("error", error.message);
      }
    };

    fetchOfferListings();

    const fetchInitialLikedList = async () => {
      if (currentUser.liked.length === 0) {
        return;
      }
      const likedList = currentUser.liked;
      const likedListData = [];
      for (const listId of likedList) {
        try {
          const res = await fetch(`/api/listing/getListing/${listId}`);
          const data = await res.json();
          if (data.success === false) {
            console.error(`liked list fetch failed error: ${data}`);
            return;
          }
          likedListData.push(data);
        } catch (error) {
          console.error(`unable to fetch liked list error: ${error.message}`);
        }
      }
      dispatch(setLiked(likedListData));
    };
    fetchInitialLikedList();
  }, [currentUser.liked, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  console.log("liked list data", liked, "current user", currentUser);

  return (
    <div>
      <div
        style={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)),url(https://images.pexels.com/photos/29799518/pexels-photo-29799518/free-photo-of-real-estate-investment-essentials-with-euro-currency.jpeg) center no-repeat`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
        className="h-[70vh] flex flex-col justify-center items-center gap-4"
      >
        <div></div>
        <div className="flex flex-wrap gap-2 justify-between items-center font-medium text-black/80 text-xl  w-[40%] px-3">
          <div>
            <button className="border border-black/80 capitalize bg-[#fcd5ce] py-1 px-4  rounded-full hover:bg-[#fee9e1] active:bg-[#c0fdfb]">
              sell
            </button>
          </div>
          <div>
            <button className="border border-black/80 capitalize bg-[#fcd5ce] py-1 px-4  rounded-full hover:bg-[#fee9e1] active:bg-[#c0fdfb]">
              Buy
            </button>
          </div>
          <div>
            <button className="border border-black/80 capitalize bg-[#fcd5ce] py-1 px-4  rounded-full hover:bg-[#fee9e1] active:bg-[#c0fdfb]">
              Rent
            </button>
          </div>
        </div>
        <div className=" w-[40%]">
          <form
            onSubmit={handleSubmit}
            className=" bg-slate-100 p-1  rounded-full flex items-center border border-black/25"
          >
            <input
              type="text"
              placeholder=" name/type of the  house "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent focus:outline-none placeholder:text-xl px-2  placeholder:font-medium  w-full placeholder:text-gray-400"
            />
            <button className="flex self-center p-3 text-center justify-center rounded-full bg-[#fcd5ce] active:bg-[#c0fdfb]">
              <FaSearch className="text-black/80  text-2xl" />
            </button>
          </form>
        </div>
      </div>
      <Container>
        <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
          <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
            Find your next <span className="text-slate-500">perfect</span>{" "}
            <br /> place with ease
          </h1>
        </div>
        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
          {offerListings && offerListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">
                  Recent offers
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?offer=true"}
                >
                  Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {rentListings && rentListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">
                  Recent places for rent
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?type=rent"}
                >
                  Show more places for rent
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {saleListings && saleListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">
                  Recent places for sale
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?type=sale"}
                >
                  Show more place for sale
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
