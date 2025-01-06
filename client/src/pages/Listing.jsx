import { useEffect, useRef, useState } from "react";
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
import { BsCalendar2WeekFill } from "react-icons/bs";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaHouseDamage } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { BsTicketDetailed } from "react-icons/bs";

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
  DialogTrigger,
} from "@/components/ui/dialog";

export const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const { listingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [openDropdown, setOpenDropdown] = useState("openHouse");
  const [dates, setDates] = useState([]);
  const contentRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [tourRequestForm, setTourRequestForm] = useState({
    phoneNumber: "",
    email: "",
    date: {},
  });

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
  }, []);

  const toggleDropdown = (dropDownId) => {
    setOpenDropdown((prev) => (prev === dropDownId ? null : dropDownId));
  };

  const handleRequestTour = (e) => {
    e.preventDefault();
    setIsOpenDialog(true);
  };

  return (
    <Container>
      <main className=" py-5">
        {error && !listing && !loading && (
          <p className="text-center text-2xl ">Something went wrong</p>
        )}
        {loading && <p>Loading..</p>}
        {listing && !loading && (
          <>
            <div className="flex gap-4  ">
              <div className=" relative  flex w-[90vw] flex-wrap custom-900:flex-nowrap  custom-900:w-[50rem] custom-900:h-[25rem] gap-2  rounded-lg flex-grow-0 flex-shrink-0">
                <div className="w-full custom-900:w-[75%]  rounded-tl-lg rounded-bl-lg overflow-clip border  ">
                  <Swiper
                    navigation
                    slidesPerView={1}
                    className="w-full h-full  "
                  >
                    {listing.imageURLS.map((url, idx) => (
                      <SwiperSlide key={url} className=" relative">
                        <img src={url} className="object-cover" />
                        <div className="absolute flex gap-2 items-center justify-between   py-1 px-4 rounded-lg   bg-black/60  bottom-5 left-5">
                          <CiCamera className=" size-7 text-white" />
                          <p className="text-white">
                            {idx + 1} / {listing.imageURLS.length}
                          </p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="absolute top-5 left-5 border rounded-full size-9 flex justify-center items-center bg-slate-100 cursor-pointer ">
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
                <div className="hidden rounded-tr-lg rounded-br-lg overflow-clip  custom-900:flex flex-col  w-[25%] gap-2  justify-between ">
                  {listing.imageURLS.slice(1, 4).map((url, idx) => (
                    <div key={idx} className="w-full h-full ">
                      <img src={url} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden xl:flex w-full">
                <ContactDeveloperForm />
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
                  {"124 Sqm Lot"}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-[#d5bdaf] p-2 rounded-xl text-slate-600 ">
                  {" "}
                  <BsFillHousesFill className="size-7 text-[#64b6ac] " />
                  {"124 Sqm House"}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap border-2 border-black/5  shadow-md shadow-[#d5bdaf] p-2 rounded-xl text-slate-600 ">
                  {" "}
                  <BsCalendar2WeekFill className="size-7 text-[#64b6ac] " />
                  {"2021 Year built"}
                </li>
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
                      onSubmit={handleRequestTour}
                      className="mx-auto border border-black/60  w-[60%] flex flex-col gap-4 justify-center items-center py-3 rounded-xl bg-[#d8e2dc] shadow-md shadow-gray-400"
                    >
                      <p className="text-center ">Schedule tour</p>
                      <p className="text-center">Choose your preferred date</p>
                      <Carousel className="w-[80%] mx-auto  ">
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
                                        {date.dayName.slice(0, 3)}
                                      </p>
                                      <p className="text-xl capitalize font-semibold text-center">
                                        {`${date.monthName.slice(0, 3)} ${
                                          date.dayNumber
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
                      <div className="w-[80%] mx-auto flex flex-col gap-6 border ">
                        <div className="relative">
                          <input
                            name="requestTourEmail"
                            type="email"
                            value={tourRequestForm.name}
                            onChange={(e) =>
                              setTourRequestForm({
                                ...tourRequestForm,
                                email: e.target.value,
                              })
                            }
                            id="requestTourEmail"
                            className="border peer placeholder-transparent border-slate-800 p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 w-full"
                            placeholder="Enter your email"
                          />
                          <label
                            htmlFor="requestTourEmail"
                            className="bg-gray-50  rounded-tl-md rounded-tr-md px-3 absolute left-5 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac]peer-focus:text-lg  peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2"
                          >
                            Email
                          </label>
                        </div>
                        <div className="relative ">
                          <input
                            name="requestTourPhone"
                            type="text"
                            value={tourRequestForm.name}
                            onChange={(e) =>
                              setTourRequestForm({
                                ...tourRequestForm,
                                phoneNumber: e.target.value,
                              })
                            }
                            id="requestTourPhone"
                            className="border peer placeholder-transparent border-slate-800 p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 w-full"
                            placeholder="Enter phone number"
                          />
                          <label
                            htmlFor="requestTourPhone"
                            className="bg-gray-50  rounded-tl-md rounded-tr-md px-3 absolute left-5 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac]peer-focus:text-lg  peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2"
                          >
                            Phone Number
                          </label>
                        </div>
                      </div>

                      <button className="p-3 font-semibold background text-white text-xl rounded-xl  capitalize bg-[#b09e99] hover:bg-[#c9b2ac] active:bg-[#c0fdfb] w-[80%] border border-black/50 ">
                        Request Tour
                      </button>
                    </form>
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
                    <div className="px-8 mt-2 text-justify font-normal">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Saepe totam fuga at aliquid, ex facere voluptatem! Porro
                      rerum dicta at saepe alias laborum incidunt, aut eos
                      maxime iste, esse optio! Lorem ipsum dolor sit amet
                      consectetur adipisicing elit. Saepe totam fuga at aliquid,
                      ex facere voluptatem! Porro rerum dicta at saepe alias
                      laborum incidunt, aut eos maxime iste, esse optio! Lorem
                      ipsum dolor sit amet consectetur adipisicing elit. Saepe
                      totam fuga at aliquid, ex facere voluptatem! Porro rerum
                      dicta at saepe alias laborum incidunt, aut eos maxime
                      iste, esse optio!
                    </div>
                  </div>
                </div>{" "}
                <div className=" mx-auto w-[70%] flex justify-center xl:hidden ">
                  <ContactDeveloperForm />
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
                      <div>
                        You have requested a tour to{" "}
                        <span className="font-semibold italic">
                          {listing.name}
                        </span>{" "}
                        at
                        <span className="font-semibold italic">
                          {" "}
                          {`${tourRequestForm.date.dayNumber}, ${tourRequestForm.date.dayName}, ${tourRequestForm.date.monthName}`}{" "}
                        </span>
                      </div>
                      <div>
                        Coordinator will call you shortly to
                        <span className="font-semibold italic">
                          {" "}
                          {tourRequestForm.phoneNumber}{" "}
                        </span>
                        to connect with an agent, Thank You!
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
