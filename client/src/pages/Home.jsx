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
import Footer from "@/components/Footer";

export const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  SwiperCore.use([Navigation]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/getListing?offer=true&limit=4`);
        const data = await res.json();

        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.error("error", error.message);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/getListing?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.error("error", error.message);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/getListing?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.error("error", error.message);
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
  }, [currentUser?.liked, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div>
      <div
        style={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)),url(https://images.pexels.com/photos/29799518/pexels-photo-29799518/free-photo-of-real-estate-investment-essentials-with-euro-currency.jpeg) center no-repeat`,
        }}
        className="h-[70vh]  flex flex-col justify-center items-center gap-8 bg-cover bg-center bg-gradient-to-b from-transparent to-black sm:bg-gradient-to-b sm:from-transparent sm:to-black md:bg-gradient-to-b md:from-black md:to-black"
      >
        <div className="flex flex-col w-[80%] md:[w-60%] lg:w-[45%   mx-auto  text-center">
          <h1 className="text-white text-2xl  md:font-extrabold md:text-6xl">
            Find your next <span className="text-slate-500">perfect</span>{" "}
            <br className="hidden md:block" /> place with ease
          </h1>
        </div>

        <div className="w-[80%] xs:w-[100%] sm:w-[60%]  md:w-[50%] lg:w-[40%]">
          <form
            onSubmit={handleSubmit}
            className=" bg-slate-100 sm:p-1  rounded-full flex items-center border     transition-all duration-1000 border-black/50 focus-within:border-black  "
          >
            <input
              type="text"
              placeholder=" name/type of the  house "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent focus:outline-none border-none focus:border-none placeholder:text-sm md:placeholder:text-lg lg:placeholder:text-xl px-2 focus:ring-0   md:placeholder:font-medium  w-full placeholder:text-gray-400 peer"
            />
            <button className="flex mr-1 sm:mr-0 p-2 lg:p-3 text-center justify-center rounded-full bg-[#fcd5ce] peer-focus:bg-[#64b6ac] active:bg-[#c0fdfb] transition-all duration-1000 border border-black/30">
              <FaSearch className="text-md md:text-xl text-slate-700    lg:text-2xl" />
            </button>
          </form>
        </div>
      </div>
      <Container>
        <div className="w-full text-center   flex flex-col gap-10  my-10 py-10 ">
          {offerListings && offerListings.length > 0 && (
            <div className="flex flex-col gap-y-14 ">
              <div>
                <h2 className="inline-block text-xl   sm:font-semibold md:text-2xl lg:text-4xl md:font-extrabold rounded-2xl  p-3 shadow-sm shadow-[#f0abfc] text-[#155e75] ">
                  Recent offers
                </h2>
              </div>
              <div className="flex  gap-7 flex-wrap  justify-center  ">
                {offerListings.map((listing) => (
                  <div key={listing._id} className="">
                    <ListingItem listing={listing} />
                  </div>
                ))}
              </div>
              <Link
                className="border w-[250px] sm:w-[300px] mx-auto border-black/30 text-md py-1 px-2 bg-[#64b6ac] rounded-lg md:text-lg text-black/70 shadow-md shadow-gray-500"
                to={"/search?offer=true"}
              >
                Show more listing with offer
              </Link>
            </div>
          )}
          {rentListings && rentListings.length > 0 && (
            <div className="flex flex-col gap-y-14">
              <div>
                <h2 className="inline-block text-xl sm:font-semibold md:text-2xl lg:text-4xl md:font-extrabold rounded-2xl p-3  shadow-sm shadow-[#f0abfc] text-[#155e75]  ">
                  {" "}
                  Recent places for rent
                </h2>
              </div>
              <div className="flex  gap-7 flex-wrap  justify-center">
                {rentListings.map((listing) => (
                  <div key={listing._id} className="">
                    <ListingItem listing={listing} />
                  </div>
                ))}
              </div>
              <Link
                className="border w-[250px] sm:w-[300px] mx-auto border-black/30 text-md py-1 px-2 bg-[#64b6ac] rounded-lg md:text-lg text-black/70 shadow-md shadow-gray-500"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
          )}
          {saleListings && saleListings.length > 0 && (
            <div className="flex flex-col gap-y-14">
              <div>
                <h2 className=" inline-block text-xl sm:font-semibold md:text-2xl lg:text-4xl md:font-extrabold  border  p-3 rounded-2xl shadow-sm shadow-[#f0abfc] text-[#155e75] ">
                  {" "}
                  Recent places for sale
                </h2>
              </div>
              <div className="flex gap-7 flex-wrap  justify-center">
                {saleListings.map((listing) => (
                  <div key={listing._id} className="">
                    <ListingItem listing={listing} />
                  </div>
                ))}
              </div>
              <Link
                className="border w-[250px] sm:w-[300px] mx-auto border-black/30 text-md py-1 px-2 bg-[#64b6ac] rounded-lg md:text-lg text-black/70 shadow-md shadow-gray-500"
                to={"/search?type=sale"}
              >
                Show more place for sale
              </Link>
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </div>
  );
};
