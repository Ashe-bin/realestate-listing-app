import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Container from "@/components/Container";

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    SearchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        SearchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/listing/getListing?${searchQuery}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          return;
        }

        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListing(data);
      } catch (error) {
        console.error("error", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, SearchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.SearchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listing.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/getListing?${searchQuery}`);
    const data = await res.json();
    if (data.success === false) {
      return;
    }
    if (data.length < 9) {
      setShowMore(false);
    }
    setListing([...listing, ...data]);
  };

  return (
    <Container className="">
      <div className="flex  flex-col md:flex-row my-10 gap-5 ">
        <div className="py-7 order-2 md:order-1 lg:flex-1 flex-shrink-0 md:w-[20rem] w-full  lg:basis-1/4 px-3 border rounded-2xl shadow-lg shadow-gray-300 border-black/10">
          <form
            onSubmit={handleSubmit}
            className=" flex text-slate-700 text-lg font-semibold flex-col gap-8"
          >
            <div className="flex  flex-col justify-center gap-2">
              <div className="relative  ">
                <input
                  name="requestTourPhone"
                  type="text"
                  id="searchTerm"
                  value={sidebarData.SearchTerm}
                  onChange={handleChange}
                  className="border peer placeholder-transparent border-slate-800 p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 w-full sm:w-[60%] md:w-full"
                  placeholder="search Term"
                />
                <label
                  htmlFor="requestTourPhone"
                  className="bg-gray-50   rounded-tl-md rounded-tr-md px-3 absolute left-5 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac]peer-focus:text-lg  peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2.5 peer-placeholder-shown:px-0  peer-placeholder-shown:bg-transparent"
                >
                  Search Term
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-wrap justify-center items-start">
              <div className="flex items-center gap-2">
                <label>Type</label>
                <input
                  type="checkbox"
                  id="all"
                  className="w-6 h-6 rounded-md focus:outline-none border focus:border-black focus:ring focus:ring-black/20 checked:bg-black/60 checked:border-black/30 "
                  onChange={handleChange}
                  checked={sidebarData.type === "all"}
                />
                <span>Rent & sale</span>
              </div>{" "}
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-6 h-6 rounded-md focus:outline-none border focus:border-black focus:ring focus:ring-black/20 checked:bg-black/60 checked:border-black/30"
                  onChange={handleChange}
                  checked={sidebarData.type === "rent"}
                />
                <span>Rent </span>
              </div>{" "}
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  onChange={handleChange}
                  checked={sidebarData.type === "sale"}
                  id="sale"
                  className="w-6 h-6 rounded-md focus:outline-none border focus:border-black focus:ring focus:ring-black/20 checked:bg-black/60 checked:border-black/30"
                />
                <span>Sale</span>
              </div>{" "}
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-6 h-6 rounded-md focus:outline-none border focus:border-black focus:ring focus:ring-black/20 checked:bg-black/60 checked:border-black/30"
                  onChange={handleChange}
                  checked={sidebarData.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex flex-col  gap-2 flex-wrap items-start justify-center">
              <label>Amenities</label>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  onChange={handleChange}
                  checked={sidebarData.parking}
                  id="parking"
                  className="w-6 h-6 rounded-md focus:outline-none border focus:border-black focus:ring focus:ring-black/20 checked:bg-black/60 checked:border-black/30"
                />
                <span>Parking</span>
              </div>{" "}
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-6 h-6 rounded-md focus:outline-none border focus:border-black focus:ring focus:ring-black/20 checked:bg-black/60 checked:border-black/30"
                  onChange={handleChange}
                  checked={sidebarData.furnished}
                />
                <span>Furnished </span>
              </div>{" "}
            </div>
            <div className="flex-col justify-center items-start gap-5">
              <label className="font-semibold">Sort </label>
              <select
                id="sort_order"
                className="w-full h-12 rounded-md focus:outline-none border border-gray-300 focus:border-black focus:ring focus:ring-black/20 bg-white px-3 text-slate-700"
                onChange={handleChange}
                value={`${sidebarData.sort}_${sidebarData.order}`}
              >
                <option
                  value="regularPrice_desc"
                  className="text-slate-700 font-semibold capitalize text-lg"
                >
                  Price high to low
                </option>
                <option
                  value="regularPrice_asc"
                  className="text-slate-700 font-semibold capitalize text-lg"
                >
                  Price low to high
                </option>
                <option
                  value="createdAt_desc"
                  className="text-slate-700 font-semibold capitalize text-lg"
                >
                  Latest
                </option>
                <option
                  value="createdAt_asc"
                  className="text-slate-700 font-semibold capitalize text-lg hover:bg-black"
                >
                  Oldest
                </option>
              </select>
            </div>
            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
              search
            </button>
          </form>
        </div>
        <div className="flex flex-col order-1 md:order-2  gap-10 p-7 flex-shrink-0 w-full sm:flex-1  lg:basis-3/4 border justify-center  rounded-2xl shadow-lg shadow-gray-300 border-black/10 ">
          <div className="flex my-4 ">
            <h1 className="inline-block text-xl   md:text-2xl lg:text-4xl   rounded-2xl py-2   px-4 shadow-inner  shadow-[#155e75]/20  text-[#155e75] capitalize mx-auto ">
              Listing results
            </h1>
          </div>
          <div className="flex justify-start items-start flex-wrap  gap-5 ">
            {!loading && listing.length === 0 && <p>No listing found!</p>}
            {!loading &&
              listing.map((list) => (
                <ListingItem key={list._id} listing={list} />
              ))}
          </div>
          <div className="border  mx-auto">
            {showMore && (
              <button
                onClick={onShowMoreClick}
                className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
              >
                Show More
              </button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Search;
