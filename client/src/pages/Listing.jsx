import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { IoSquare } from "react-icons/io5";
import { BsFillHousesFill } from "react-icons/bs";

import { useSelector } from "react-redux";
import Contact from "../components/Contact";
import Container from "@/components/Container";
import { CiCamera } from "react-icons/ci";

export const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const { listingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/listing/getListing/${listingId}`);
        const data = await res.json();
        if (data.success == false) {
          setError(data.message);

          return;
        }
        setListing(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);
  console.log("listing see", listing);

  return (
    <Container>
      <main className=" py-5">
        {error &&
          !listing &&
          !loading(
            <p className="text-center text-2xl ">Something went wrong</p>
          )}
        {loading && <p>Loading..</p>}
        {listing && !loading && (
          <>
            <div className="flex gap-4 shrink">
              <div className=" relative  flex w-[100%] flex-wrap custom-900:flex-nowrap custom-900:w-[50rem] custom-900:h-[25rem] gap-2  rounded-lg flex-grow">
                <div className="w-full custom-900:w-[75%] h-full rounded-tl-lg rounded-bl-lg overflow-clip ">
                  <Swiper
                    navigation
                    slidesPerView={1}
                    className="w-full h-full  "
                  >
                    {listing.imageURLS.map((url, idx) => (
                      <SwiperSlide key={url} className=" relative">
                        <img src={url} className="object-cover" />
                        <div className="flex gap-2 items-center justify-between absolute z-50 py-1 px-4 rounded-lg   bg-black/60  bottom-5 left-5">
                          <CiCamera className="size-7 text-white" />
                          <p className="text-white">
                            {idx + 1} / {listing.imageURLS.length}
                          </p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="absolute top-5 left-5 z-10 border rounded-full size-9 flex justify-center items-center bg-slate-100 cursor-pointer">
                    <FaShare
                      className="text-slate-500"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopied(true);
                        setTimeout(() => {
                          setCopied(false);
                        }, 3000);
                      }}
                    />
                  </div>
                  {copied && (
                    <p className="absolute top-14 left-8 z-[999] rounded-md bg-slate-100 p-2">
                      Link copied!
                    </p>
                  )}
                </div>
                <div className="rounded-tr-lg rounded-br-lg overflow-clip hidden sm:flex custom-900:flex-col w-[100%] custom-900:w-[25%] h-full gap-2  justify-between ">
                  {listing.imageURLS.slice(1, 4).map((url, idx) => (
                    <div key={idx} className="w-full h-full ">
                      <img src={url} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border border-black/50 shadow-md shadow-gray-500 rounded-lg bg-[#d8e2dc]">
                <p className="text-center text-lg py-4">
                  {" "}
                  More about this property
                </p>
                <form className=" flex flex-col justify-center  gap-6 ">
                  <div className="relative ">
                    <input
                      name="fullName"
                      type="text"
                      id="fullName"
                      className="border peer placeholder-transparent border-slate-800 p-2 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
                      placeholder="Enter full name"
                    />
                    <label
                      htmlFor="fullName"
                      className="bg-gray-50  rounded-tl-md rounded-tr-md px-2 absolute left-3 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac] 
                      
                      peer-focus:text-sm  peer-focus:-top-[1.2rem]
                      
                      peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2"
                    >
                      Full Name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      id="email"
                      className="border peer placeholder-transparent border-slate-800 p-2 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
                      placeholder="Enter your email"
                    />
                    <label
                      htmlFor="email"
                      className="bg-gray-50  rounded-tl-md rounded-tr-md px-2 absolute left-3 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac] 
                      
                      peer-focus:text-sm  peer-focus:-top-[1.2rem]
                      
                      peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2"
                    >
                      Email
                    </label>
                  </div>
                  <div className="relative ">
                    <input
                      name="phone"
                      type="text"
                      id="phone"
                      className="border peer placeholder-transparent border-slate-800 p-2 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
                      placeholder="Enter phone number"
                    />
                    <label
                      htmlFor="phone"
                      className="bg-gray-50  rounded-tl-md rounded-tr-md px-2 absolute left-3 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac] 
                      
                      peer-focus:text-sm  peer-focus:-top-[1.2rem]
                      
                      peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2"
                    >
                      Phone Number
                    </label>
                  </div>
                  <div className="relative">
                    <textarea
                      name="message"
                      id="message"
                      className="w-full border peer placeholder-transparent border-slate-800 p-2 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
                      placeholder="please provide how contacting developer helps you"
                      cols={8}
                      rows={3}
                    ></textarea>
                    <label
                      htmlFor="message"
                      className="bg-gray-50  rounded-tl-md rounded-tr-md px-2 absolute left-3 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac] 
                      
                      peer-focus:text-sm  peer-focus:-top-[1.2rem]
                      
                      peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2"
                    >
                      Message
                    </label>
                  </div>
                  <button className="p-3 background text-white text-lg rounded-full capitalize bg-[#b09e99] hover:bg-[#c9b2ac] active:bg-[#c0fdfb] ">
                    Contact developer
                  </button>
                </form>
              </div>
            </div>
            <div className="flex  flex-col max-w-4xl  p-3 my-7 gap-4 ">
              <p className="text-2xl font-semibold">
                {listing?.name} - ${" "}
                {listing?.offer
                  ? listing?.discountPrice.toLocaleString("en-US")
                  : listing?.regularPrice.toLocaleString("en-US")}
              </p>
              <p className="flex items-center mt-6 gap-2 text-slate-600 text-lg font-semibold italic">
                <FaMapMarkerAlt className=" size-6 text-[#64b6ac]" />
                {listing.address}
              </p>
              <div className="flex gap-4">
                <p className="bg-[#64b6ac] border border-black/30 shadow-sm shadow-gray-500 text-lg font-semibold w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </p>
                {listing.offer && (
                  <p className="bg-[#64b6ac] border border-black/30 shadow-sm shadow-gray-500 text-lg font-semibold w-full max-w-[200px] text-white text-center p-1 rounded-md">
                    $ {+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
                )}
              </div>
              <p className="text-slate-800 text-xl ">{listing.description}</p>
              <ul className="text-xl  flex flex-wrap items-center gap-4 sm:gap-6">
                <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-gray-300 p-2 rounded-xl text-slate-600">
                  <FaBed className="size-7 text-[#64b6ac] " />
                  {listing?.bedRoom > 1
                    ? `${listing?.bedRoom} beds`
                    : `${listing?.bedRoom} bed`}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-gray-300 p-2 rounded-xl text-slate-600">
                  {" "}
                  <FaBath className="size-7 text-[#64b6ac] " />
                  {listing.bathRoom > 1
                    ? `${listing?.bathRoom} baths`
                    : `${listing?.bathRoom} bath`}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-gray-300 p-2 rounded-xl text-slate-600">
                  {" "}
                  <FaParking className="size-7 text-[#64b6ac] " />
                  {listing.parking ? "Parking Spot" : "No Parking"}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-gray-300 p-2 rounded-xl text-slate-600">
                  {" "}
                  <FaChair className="size-7 text-[#64b6ac] " />
                  {listing.furnished ? "Furnished" : "Unfurnished"}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-gray-300 p-2 rounded-xl text-slate-600">
                  {" "}
                  <IoSquare className="size-7 text-[#64b6ac] " />
                  {"124 Sqm Lot"}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-gray-300 p-2 rounded-xl text-slate-600 ">
                  {" "}
                  <BsFillHousesFill className="size-7 text-[#64b6ac] " />
                  {"124 Sqm House"}
                </li>
              </ul>
              {currentUser &&
                listing.userRef == currentUser._id &&
                !contact && (
                  <button
                    onClick={() => setContact(true)}
                    className="bg-slate-700 w-[60%] mx-auto text-white rounded-lg uppercase hover:opacity-95 p-3"
                  >
                    Contact Landlord
                  </button>
                )}
              {contact && <Contact listing={listing} />}
            </div>
          </>
        )}
      </main>
    </Container>
  );
};
