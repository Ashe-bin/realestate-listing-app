import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

import Container from "@/components/Container";
import { CiCamera } from "react-icons/ci";
import { BsCalendar2WeekFill } from "react-icons/bs";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaHouseDamage } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { BsTicketDetailed } from "react-icons/bs";
import { MdOutlineCategory } from "react-icons/md";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ContactDeveloperForm from "@/components/ContactDeveloperForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { ListingPageSkeleton } from "@/components/Skeleton";
import { TbFaceIdError } from "react-icons/tb";
import LazyLoads from "@/components/LazyLoads";
import { useSelector } from "react-redux";

export const Listing = () => {
  const {
    register,
    reset,
    handleSubmit: handleRequestTour,
    formState: { errors },
  } = useForm();

  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const { listingId } = useParams();
  const [fetchListingError, setFetchListingError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("openHouse");
  const [dates, setDates] = useState([]);
  const contentRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const [tourRequestForm, setTourRequestForm] = useState({
    phoneNumber: "",
    email: "",
    date: {},
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      setIsPageLoading(true);
      setFetchListingError(false);
      try {
        const res = await fetch(`/api/listing/getListing/${listingId}`);
        const data = await res.json();
        if (data.success == false) {
          setFetchListingError(true);

          return;
        }
        setListing(data);
      } catch (error) {
        console.error(`error fetching list ${error.message}`);
        setFetchListingError(true);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  useEffect(() => {
    const generateNextSevenDays = () => {
      const daysArray = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        const dayNumber = date.getDate();
        const monthName = date.toLocaleDateString("en-US", { month: "long" });

        daysArray.push({ dayName, dayNumber, monthName });
      }
      setDates(daysArray);
      setSelectedIndex(0);
    };
    generateNextSevenDays();
    setTourRequestForm((prev) => ({ ...prev, date: dates[0] }));
  }, []);

  const toggleDropdown = (dropDownId) => {
    setOpenDropdown((prev) => (prev === dropDownId ? null : dropDownId));
  };

  const onSubmit = (data) => {
    setTourRequestForm((prev) => ({
      ...prev,
      email: data.email,
      phoneNumber: data.phoneNumber,
    }));
    setIsOpenDialog(true);
    reset();
  };
  return (
    <Container>
      <main className=" py-5">
        {fetchListingError && !listing && !isPageLoading && (
          <div className="flex flex-col gap-4 items-center justify-center h-[50%]  text-center px-4 py-10 ">
            <TbFaceIdError className="w-24 h-24 text-slate-700 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">
              Its Our bad, Could not fetch listing
            </h2>
            <p className="text-muted-foreground text-lg">
              Go back to home page and try again
            </p>
            <button
              className="border border-black/60 capitalize bg-[#c0fdfb] py-1 px-4  rounded-md hover:bg-[#d8e2dc] active:bg-[#c0fdfb] text-lg font-semibold text-slate-700"
              onClick={() => {
                navigate(`/`);
              }}
            >
              Back
            </button>{" "}
          </div>
        )}
        {isPageLoading && <ListingPageSkeleton />}
        {listing && !isPageLoading && (
          <>
            <div className="flex gap-4   ">
              <div className=" relative  flex w-[90vw]  lg:w-[60rem] h-[30rem] gap-2 rounded-lg flex-grow-0 flex-shrink ">
                <div className="w-full md:w-[75%] h-full  rounded-tl-lg rounded-bl-lg overflow-clip border  ">
                  <Link to={`/listing/${listing._id}/show-image`}>
                    <Swiper
                      navigation
                      slidesPerView={1}
                      className="w-full h-full   "
                    >
                      {listing.imageURLS.map((url, idx) => (
                        <SwiperSlide key={url} className=" relative">
                          <LazyLoads
                            listing={true}
                            src={url}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute flex gap-2 items-center justify-between   py-1 px-4 rounded-lg   bg-black/60  bottom-5 left-5">
                            <CiCamera className=" size-7 text-white" />
                            <p className="text-white">
                              {idx + 1} / {listing.imageURLS.length}
                            </p>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Link>
                  <div className="absolute top-5 left-5 border rounded-full size-9 flex justify-center items-center bg-slate-100 z-50 cursor-pointer  ">
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
                {listing?.imageURLS && (
                  <div className="hidden rounded-tr-lg rounded-br-lg overflow-clip md:grid grid-rows-[1fr_1fr_1fr] w-[25%] gap-2  h-full">
                    {listing.imageURLS.slice(1, 4).map((url, idx) => (
                      <Link key={idx} to={`/listing/${listing._id}/show-image`}>
                        <LazyLoads
                          src={url}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex  flex-col max-w-5xl    p-3 my-7 gap-4 ">
              <p className="text-2xl font-semibold">
                {listing?.name} - ${" "}
                {listing?.offer
                  ? listing?.discountPrice.toLocaleString("en-US")
                  : listing?.regularPrice.toLocaleString("en-US")}
                {listing.type === "rent" ? " / Month" : ""}
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
                    {(
                      ((+listing.regularPrice - +listing.discountPrice) /
                        +listing.regularPrice) *
                      100
                    ).toFixed(2)}
                    % discount
                  </p>
                )}
              </div>
              <p className="text-slate-800 text-xl ">{listing.description}</p>
              <ul className="text-xl  flex flex-wrap items-center gap-4 sm:gap-6">
                <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-[#d5bdaf] p-2 rounded-xl text-slate-600">
                  <FaBed className="size-7 text-[#64b6ac] " />
                  {listing?.bedRoom > 1
                    ? `${listing?.bedRoom} beds`
                    : `${listing?.bedRoom} bed`}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-[#d5bdaf] p-2 rounded-xl text-slate-600">
                  {" "}
                  <FaBath className="size-7 text-[#64b6ac] " />
                  {listing.bathRoom > 1
                    ? `${listing?.bathRoom} baths`
                    : `${listing?.bathRoom} bath`}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-[#d5bdaf] p-2 rounded-xl text-slate-600">
                  {" "}
                  <FaParking className="size-7 text-[#64b6ac] " />
                  {listing.parking ? "Parking Spot" : "No Parking"}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-[#d5bdaf] p-2 rounded-xl text-slate-600">
                  {" "}
                  <FaChair className="size-7 text-[#64b6ac] " />
                  {listing.furnished ? "Furnished" : "Unfurnished"}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-[#d5bdaf] p-2 rounded-xl text-slate-600">
                  {" "}
                  <IoSquare className="size-7 text-[#64b6ac] " />
                  {+listing?.lotArea > 0
                    ? `${+listing?.lotArea} Sqm Lot`
                    : "No lot area"}
                </li>
                {listing?.houseArea && (
                  <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-[#d5bdaf] p-2 rounded-xl text-slate-600 ">
                    {" "}
                    <BsFillHousesFill className="size-7 text-[#64b6ac] " />
                    {`${listing?.houseArea} Sqm House`}
                  </li>
                )}
                {listing?.developedDate && (
                  <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-[#d5bdaf] p-2 rounded-xl text-slate-600 ">
                    {" "}
                    <BsCalendar2WeekFill className="size-7 text-[#64b6ac] " />
                    {`${listing?.developedDate} Year built`}
                  </li>
                )}
              </ul>
              <div className="flex flex-col gap-4 justify-center text-slate-700 font-semibold text-xl">
                <div className="border border-black/30 shadow-lg shadow-[#d5bdaf] rounded-lg p-4 flex flex-col justify-center cursor-pointer">
                  <div
                    className="flex  justify-between transition-all duration-1000"
                    onClick={() => toggleDropdown("openHouse")}
                  >
                    <div className="flex items-center gap-2">
                      <FaHouseDamage className="size-7" />
                      <p>Open house</p>
                    </div>
                    {openDropdown === "openHouse" ? (
                      <IoIosArrowUp className=" size-10" />
                    ) : (
                      <IoIosArrowDown className="size-10" />
                    )}
                  </div>

                  <div
                    ref={contentRef}
                    className={`transition-all duration-1000 ease-in-out overflow-hidden p-2`}
                    style={{
                      maxHeight: openDropdown === "openHouse" ? `30rem` : "0px",

                      opacity: openDropdown === "openHouse" ? 1 : 0,
                    }}
                  >
                    <form
                      onSubmit={handleRequestTour(onSubmit)}
                      className="mx-auto border border-black/60 w-full  sm:w-[60%] flex flex-col gap-4 justify-center items-center py-3 rounded-xl bg-[#d8e2dc] shadow-md shadow-gray-400 "
                    >
                      <p className="text-center ">Schedule tour</p>
                      <p className="text-center">Choose your preferred date</p>
                      <Carousel className="w-[90%] sm:w-[80%]   ">
                        <CarouselContent className="">
                          {dates?.map((date, index) => (
                            <div key={index}>
                              <CarouselItem className="  m-1">
                                <div
                                  className=""
                                  onClick={() => {
                                    setTourRequestForm({
                                      ...tourRequestForm,
                                      date: date,
                                    });
                                    setSelectedIndex(index);
                                  }}
                                >
                                  <Card
                                    className={`border border-black/70  h-[5rem] w-[8rem] flex items-center justify-center transition ${
                                      selectedIndex === index
                                        ? "bg-black/60 text-white"
                                        : "hover:bg-gray-300"
                                    }`}
                                  >
                                    <CardContent className="h-full flex flex-col justify-center py-1">
                                      <p className="text-xl capitalize font-semibold text-center ">
                                        {date?.dayName.slice(0, 3)}
                                      </p>
                                      <p className="text-xl capitalize font-semibold text-center">
                                        {`${date.monthName.slice(0, 3)} ${
                                          date?.dayNumber
                                        }`}
                                      </p>
                                    </CardContent>
                                  </Card>
                                </div>
                              </CarouselItem>
                            </div>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="bg-white border border-black/40 " />
                        <CarouselNext className="bg-white border border-black/40 " />
                      </Carousel>
                      <div className=" w-[90%]  sm:w-[80%] mx-auto flex flex-col gap-6 border ">
                        <div className="relative">
                          <input
                            name="requestTourEmail"
                            type="text"
                            id="requestTourEmail"
                            className="border peer placeholder-transparent border-slate-800 p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 w-full font-normal"
                            placeholder="Enter your email"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email address",
                              },
                            })}
                          />
                          <label
                            htmlFor="requestTourEmail"
                            className="bg-gray-50  rounded-tl-md rounded-tr-md px-3 absolute left-5 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac]peer-focus:text-lg  peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2.5 font-normal"
                          >
                            Email
                          </label>
                          {errors.email && (
                            <p className="text-red-500 text-sm py-1 font-normal">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                        <div className="relative  ">
                          <input
                            name="requestTourPhone"
                            type="text"
                            id="requestTourPhone"
                            className="border peer placeholder-transparent border-slate-800 p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 w-full font-normal"
                            placeholder="Enter phone number"
                            {...register("phoneNumber", {
                              required: "Phone number is required",
                              pattern: {
                                value: /^\+?\d+$/,
                                message:
                                  "Phone number can only include number and + to specify country code",
                              },
                            })}
                          />
                          <label
                            htmlFor="requestTourPhone"
                            className="bg-gray-50  rounded-tl-md rounded-tr-md px-3 absolute left-5 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac]peer-focus:text-lg  peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2.5 font-normal"
                          >
                            Phone Number
                          </label>
                          {errors.phoneNumber && (
                            <p className="text-red-500 text-sm py-1 font-normal">
                              {errors.phoneNumber.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        disabled={
                          listing?.userRef === currentUser?._id || !currentUser
                        }
                        className="p-3 font-semibold background text-zinc-600 text-xl rounded-xl  capitalize bg-gradient-to-r from-teal-200 via-white/60 to-black/30 hover:bg-[#c9b2ac] active:bg-[#c0fdfb] w-[90%] sm:w-[80%] border border-black/50 disabled:cursor-not-allowed "
                        title={
                          listing?.userRef === currentUser?._id
                            ? "You cannot request a tour for your own listing"
                            : !currentUser
                            ? "Please sign in first"
                            : ""
                        }
                      >
                        Request Tour
                      </button>
                    </form>
                  </div>
                </div>
                <div className="border border-black/30 shadow-lg shadow-[#d5bdaf] rounded-lg p-4 flex flex-col justify-center cursor-pointer">
                  <div
                    className="flex  justify-between transition-all duration-1000"
                    onClick={() => toggleDropdown("propertyType")}
                  >
                    <div className="flex items-center gap-2">
                      <MdOutlineCategory className="size-7" />
                      <p>Property Type</p>
                    </div>
                    {openDropdown === "propertyType" ? (
                      <IoIosArrowUp className=" size-10" />
                    ) : (
                      <IoIosArrowDown className="size-10" />
                    )}
                  </div>

                  <div
                    className={`transition-all duration-1000 ease-in-out overflow-y-scroll p-2`}
                    style={{
                      maxHeight:
                        openDropdown === "propertyType" ? `30rem` : "0px",

                      opacity: openDropdown === "propertyType" ? 1 : 0,
                    }}
                  >
                    {listing?.propertyType && (
                      <div className="px-8 mt-2 text-justify font-normal">
                        {listing?.propertyType}
                      </div>
                    )}
                  </div>
                </div>
                <div className="border border-black/30 shadow-lg shadow-[#d5bdaf] rounded-lg p-4 flex flex-col justify-center cursor-pointer">
                  <div
                    className="flex  justify-between transition-all duration-1000"
                    onClick={() => toggleDropdown("propertyDetail")}
                  >
                    <div className="flex items-center gap-2">
                      <BsTicketDetailed className="size-7" />
                      <p>Property detail</p>
                    </div>
                    {openDropdown === "propertyDetail" ? (
                      <IoIosArrowUp className=" size-10" />
                    ) : (
                      <IoIosArrowDown className="size-10" />
                    )}
                  </div>

                  <div
                    className={`transition-all duration-1000 ease-in-out overflow-y-scroll p-2`}
                    style={{
                      maxHeight:
                        openDropdown === "propertyDetail" ? `30rem` : "0px",

                      opacity: openDropdown === "propertyDetail" ? 1 : 0,
                    }}
                  >
                    {listing?.propertyDetail && (
                      <div className="px-8 mt-2 text-justify font-normal">
                        {listing?.propertyDetail}
                      </div>
                    )}
                  </div>
                </div>{" "}
                <div className=" mx-auto w-full sm:w-[70%] flex justify-center  ">
                  <ContactDeveloperForm listing={listing} />
                </div>
                <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Tour Request received</DialogTitle>
                      <DialogDescription>
                        Request Tour processed successfully!
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col justify center gap-2 text-slate-700 text-lg text-left">
                      <div className="flex flex-col">
                        You have requested a tour to{" "}
                        <span className="font-semibold italic">
                          {listing?.name}
                        </span>{" "}
                        on location
                        <span className="font-semibold italic">
                          {listing.address}{" "}
                        </span>{" "}
                        at
                        <span className="font-semibold italic">
                          {" "}
                          {`${tourRequestForm.date?.dayNumber}, ${tourRequestForm.date?.dayName}, ${tourRequestForm.date?.monthName}`}{" "}
                        </span>
                      </div>
                      <div>
                        Coordinator will call you shortly to
                        <span className="font-semibold italic">
                          {" "}
                          {tourRequestForm?.phoneNumber}{" "}
                        </span>
                        to connect you with an agent, Thank You!
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="primary"
                          className="bg-slate-700 text-white text-md hover:bg-slate-600"
                        >
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </>
        )}
      </main>
    </Container>
  );
};
