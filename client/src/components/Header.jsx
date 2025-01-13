import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Container from "./Container";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MdMenu } from "react-icons/md";
import { RiCloseLargeFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import LazyLoads from "./LazyLoads";

export const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuBar, setOpenMenuBar] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { liked } = useSelector((state) => state.userLiked);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const toggleMenuBar = () => {
    setOpenMenuBar((prev) => !prev);
  };

  return (
    <header className="sticky top-0 backdrop-filter backdrop-blur-3xl z-[999]   py-2 bg-black/20 shadow-gray-800 shadow-md  ">
      <Container>
        <div className="flex justify-between  flex-wrap sm:flex-nowrap  items-center  mx-auto py-4 gap-2 ">
          <Link to="/" className="order-1">
            <h1 className="font-bold text-2xl flex flex-col lg:flex-row items-left justify-center relative   rounded-xl p-1  ">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-[#45accb] uppercase">
                Real-
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-700 to-yellow-500 uppercase">
                Listing
              </span>
            </h1>
          </Link>

          {pathname !== "/" &&
            pathname !== "/sign-in" &&
            pathname !== "/sign-up" && (
              <form
                onSubmit={handleSubmit}
                className=" bg-slate-100  flex-shrink-0 sm:flex-shrink pr-1 md:p-1 order-3 sm:order-2  w-full rounded-full flex items-center border border-black/50 sm:w-[60%] custom-900:w-[40%] focus-within:border-black transition duration-1000 mx-auto"
              >
                <input
                  type="text"
                  placeholder="Search "
                  value={searchTerm ?? ""}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent focus:outline-none placeholder:text-sm px-2   md:placeholder:font-medium  w-full placeholder:text-gray-400 border-none focus:ring-0 peer"
                />
                <button className="flex self-center p-2 md:p-[10px] text-center justify-center rounded-full bg-yellow-700 peer-focus:bg-[#64b6ac] active:bg-[#c0fdfb] transition-all duration-1000 border border-black/30">
                  <FaSearch className="text-white  md:text-lg" />
                </button>
              </form>
            )}
          <div
            className="flex border justify-end  order-2 sm:order-3 p-1 rounded-lg bg-white/70  border-black/40 lg:hidden "
            onClick={toggleMenuBar}
          >
            <MdMenu size={30} />
          </div>
          <div
            className={`lg:hidden absolute h-screen top-0 right-0 w-[90%] sm:w-[50%] bg-[#d6ccc2] text-white z-[999] shadow-lg shadow-slate-700 transition-all duration-300 ease-in-out ${
              openMenuBar
                ? "opacity-100 translate-x-0 block"
                : "opacity-0 translate-x-full hidden"
            }`}
            style={{
              pointerEvents: openMenuBar ? "auto" : "none",
            }}
          >
            <div className="p-3    h-20  flex items-center">
              <RiCloseLargeFill
                className={` hover:text-red-700 transition-all duration-700  text-red-400 text-4xl rounded-lg hover:rounded-2xl `}
                onClick={toggleMenuBar}
              />
            </div>
            <div className="px-5 py-2">
              <ul className="flex flex-col text-lg font-semibold   justify-around  ">
                <Link to="/">
                  <li
                    className="group hover:px-10 transition-all duration-700 text-slate-700 "
                    onClick={toggleMenuBar}
                  >
                    <button
                      className={`text-left text-xl rounded-md w-full  border-black/50 capitalize p-3  group-hover:bg-[#fee9e1] active:bg-[#c0fdfb]  ${
                        pathname === "/" ? "bg-white" : ""
                      } transition duration-300  `}
                    >
                      Home
                    </button>
                  </li>
                </Link>
                <Link to="/about">
                  <li
                    className="group hover:px-10 transition-all duration-700 text-slate-700 "
                    onClick={toggleMenuBar}
                  >
                    <button
                      className={`text-left text-xl rounded-md w-full  border-black/50 capitalize p-3  group-hover:bg-[#fee9e1] active:bg-[#c0fdfb]  ${
                        pathname === "/about" ? "bg-white" : ""
                      } transition duration-300  `}
                    >
                      {" "}
                      About
                    </button>
                  </li>
                </Link>
                <Link
                  to={`${
                    liked.length > 0 ? "/show-listing#saved-listing" : ""
                  }`}
                >
                  <li
                    className="group hover:px-10 transition-all duration-700 text-slate-700 "
                    onClick={toggleMenuBar}
                  >
                    <button
                      className={` flex align-center gap-2 text-left text-xl rounded-md w-full  border-black/50 capitalize p-3  group-hover:bg-[#fee9e1] active:bg-[#c0fdfb]  ${
                        pathname === "/show-listing" ? "bg-white" : ""
                      } transition duration-300  `}
                    >
                      saved Message
                      <IoMdHeartEmpty className="text-black/70 text-3xl" />
                    </button>
                  </li>
                </Link>

                {currentUser ? (
                  <div
                    className={`hover:bg-white py-2   rounded-md group transition-all duration-700 ${
                      pathname === "/profile " ? "bg-white " : ""
                    } `}
                  >
                    <NavigationMenu className="w-full">
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger
                            className={`flex gap-2  rounded-md  transition-all duration-700`}
                          >
                            {currentUser?.avatar ? (
                              <img
                                className="rounded-full w-9 h-9 object-cover"
                                src={currentUser.avatar}
                                alt="profile "
                              />
                            ) : (
                              <FaUserAlt className="text-slate-700 size-10 rounded-full border border-black/30" />
                            )}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className=" text-black/80 flex flex-col gap-2 ">
                            <NavigationMenuLink class="block whitespace-nowrap hover:bg-white px-4 py-2 w-full">
                              <Link to="/profile" onClick={toggleMenuBar}>
                                Profile
                              </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink className="block whitespace-nowrap hover:bg-white px-4 py-2">
                              <Link
                                to="/create-listing"
                                onClick={toggleMenuBar}
                              >
                                Create Listing
                              </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink className="block whitespace-nowrap hover:bg-white px-4 py-2">
                              <Link to="/show-listing" onClick={toggleMenuBar}>
                                My Listings
                              </Link>
                            </NavigationMenuLink>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </div>
                ) : (
                  <Link to="/sign-in">
                    <li
                      className="w  text-slate-700 hover:underline "
                      onClick={toggleMenuBar}
                    >
                      <button
                        className={` w-full border-black/60 capitalize p-3 hover:bg-[#fee9e1] active:bg-[#c0fdfb]  ${
                          pathname === "/about" ? "bg-white" : ""
                        } transition duration-300`}
                      >
                        Sign in
                      </button>
                    </li>
                  </Link>
                )}
              </ul>
            </div>
          </div>
          <ul className="hidden order-2 lg:flex text-lg font-semibold gap-4  justify-around items-center ">
            <Link to="/">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                <button
                  className={`text-nowrap   capitalize py-1 px-4  rounded-md    hover:shadow-lg  shadow-pink-400  overflow-clip text-zinc-800 hover:from-pink-300 hover:to-teal-300 transition-all duration-1000 ${
                    pathname === "/"
                      ? "bg-white"
                      : " bg-gradient-to-r  from-teal-300    to-rose-300"
                  } transition duration-300`}
                >
                  Home
                </button>
              </li>
            </Link>

            <Link
              to={`${liked.length > 0 ? "/show-listing#saved-listing" : ""}`}
            >
              <NavigationMenu className="  ">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      hasDropdown={true}
                      className={`flex gap-2  ${
                        pathname === "/show-listing"
                          ? "bg-white"
                          : "bg-gradient-to-r from-teal-300   to-rose-300 hover:from-pink-300 hover:to-teal-300"
                      }`}
                    >
                      <li className="hidden sm:inline hover:underline">
                        <button className="group   capitalize bg-white/30  p-1 rounded-full group-hover:bg-[#fee9e1] active:bg-[#c0fdfb] flex justify-center items-center ">
                          {" "}
                          <IoMdHeartEmpty className="text-black/70 text-2xl" />
                        </button>
                      </li>
                    </NavigationMenuTrigger>
                    {pathname !== "/show-listing" && (
                      <NavigationMenuContent className="custom-scrollbar text-slate-700 capitalize flex flex-col gap-2  max-h-64  overflow-y-scroll">
                        {liked.length > 0 ? (
                          <Link
                            to={"/show-listing#saved-listing"}
                            className="p-2 hover:underline cursor-pointer"
                          >
                            <p>view saved listing</p>
                          </Link>
                        ) : (
                          <p className="p-2 block whitespace-nowrap">
                            No saved listings
                          </p>
                        )}
                        {liked.length > 0 &&
                          liked.map((listing, idx) => (
                            <NavigationMenuLink
                              key={idx}
                              class="block whitespace-nowrap  hover:bg-white px-4 py-2 "
                            >
                              <div className="flex gap-2 font-normal items-center  ">
                                <div className="h-16 w-16  overflow-clip rounded-xl">
                                  <LazyLoads
                                    src={listing.imageURLS[0]}
                                    alt="cover image"
                                    className="w-full h-full object-cover  rounded-md"
                                  />
                                </div>
                                <div className="flex flex-col ">
                                  <p className="block whitespace-nowrap text-md truncate">
                                    {`${listing.name.slice(0, 20)}...`}
                                  </p>

                                  <p className="block whitespace-nowrap text-sm">
                                    {listing.address}
                                  </p>
                                </div>
                              </div>
                            </NavigationMenuLink>
                          ))}
                      </NavigationMenuContent>
                    )}
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </Link>

            {currentUser ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`flex gap-2  ${
                        pathname === "/profile" ||
                        pathname === "/create-listing"
                          ? "bg-white"
                          : "bg-gradient-to-r from-teal-300  to-rose-300 hover:from-pink-300 hover:to-teal-300"
                      }`}
                    >
                      <Link to="/profile">
                        {currentUser?.avatar ? (
                          <img
                            className="rounded-full w-9 h-9 object-cover"
                            src={currentUser.avatar}
                            alt="profile "
                          />
                        ) : (
                          <FaUserAlt className="text-slate-700 size-9 rounded-full border border-black/30" />
                        )}
                      </Link>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className=" text-black/80 flex flex-col gap-2 ">
                      <NavigationMenuLink class="block whitespace-nowrap hover:bg-white  ">
                        <Link to="/profile">
                          <p className="text-slate-700 px-4 py-2">Profile</p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block whitespace-nowrap hover:bg-white ">
                        <Link to="/create-listing">
                          <p className="text-slate-700 px-4 py-2">
                            Create Listing
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block whitespace-nowrap hover:bg-white ">
                        <Link to="/show-listing">
                          <p className="text-slate-700 px-4 py-2">
                            My Listings
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <Link to="/sign-in">
                <li className=" sm:inline text-slate-700 hover:underline">
                  <button
                    className={`text-nowrap   capitalize py-1 px-4  rounded-md    hover:shadow-lg  shadow-pink-400  overflow-clip text-zinc-800 hover:from-pink-300 hover:to-teal-300 transition-all duration-1000  ${
                      pathname === "/sign-in" || pathname === "/sign-up"
                        ? "bg-white"
                        : " bg-gradient-to-r  from-teal-300    to-rose-300"
                    } transition duration-300`}
                  >
                    Sign in
                  </button>
                </li>
              </Link>
            )}
            <Link to="/about">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                <button
                  className={`  text-nowrap   capitalize py-1 px-4  rounded-md    hover:shadow-lg  shadow-pink-400  overflow-clip text-zinc-800 hover:from-pink-300 hover:to-teal-300 transition-all duration-1000 ${
                    pathname === "/about"
                      ? "bg-white"
                      : " bg-gradient-to-r from-teal-300 to-rose-300 "
                  } transition duration-300`}
                >
                  {" "}
                  About us
                </button>
              </li>
            </Link>
          </ul>
        </div>
      </Container>
    </header>
  );
};
