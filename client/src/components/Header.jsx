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

export const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
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
  console.log("pathname", pathname);
  return (
    <header className="sticky top-0 z-50 backdrop-filter backdrop-blur-3xl   py-2 transparent shadow-gray-800 shadow-md">
      <Container>
        <div className="flex justify-between  items-center  mx-auto py-4 pr-12 ">
          <Link to="/" className="">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
              <span className="text-black uppercase">Real-</span>
              <span className="text-red-700 uppercase">Listing</span>
            </h1>
          </Link>

          {pathname !== "/" &&
            pathname !== "/sign-in" &&
            pathname !== "sign-up" && (
              <form
                onSubmit={handleSubmit}
                className=" bg-slate-100 p-1  rounded-full flex items-center border border-black/25 w-[40%] focus-within:border-black transition duration-1000"
              >
                <input
                  type="text"
                  placeholder=" name/type of the  house "
                  value={searchTerm ?? ""}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent focus:outline-none placeholder:text-sm px-2  placeholder:font-medium  w-full placeholder:text-gray-400 border-none focus:ring-0 peer"
                />
                <button className="flex self-center p-[10px] text-center justify-center rounded-full bg-[#fcd5ce] peer-focus:bg-[#64b6ac] active:bg-[#c0fdfb] transition-all duration-1000">
                  <FaSearch className="text-black/80  text-lg" />
                </button>
              </form>
            )}
          <ul className="flex  gap-4  justify-around items-center">
            <Link to="/">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                <button
                  className={`border border-black/60 capitalize  py-1 px-4  rounded-full hover:bg-[#fee9e1]active:bg-[#c0fdfb] bg-[#fcd5ce]  ${
                    pathname === "/" ? " border-dotted" : ""
                  } transition duration-300`}
                >
                  Home
                </button>
              </li>
            </Link>
            <Link to="/about">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                <button
                  className={`border border-black/60 capitalize py-1 px-4  rounded-full hover:bg-[#fee9e1] active:bg-[#c0fdfb] bg-[#fcd5ce] ${
                    pathname === "/about" ? "border-dotted" : ""
                  } transition duration-300`}
                >
                  {" "}
                  About
                </button>
              </li>
            </Link>
            <Link
              to={`${liked.length > 0 ? "/show-listing#saved-listing" : ""}`}
            >
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      hasDropdown={true}
                      className={`flex gap-2 ${
                        pathname === "/show-listing"
                          ? "border border-dotted"
                          : ""
                      }`}
                    >
                      <li className="hidden sm:inline hover:underline">
                        <button className=" capitalize bg-[#fcd5ce]  p-[6px] rounded-full hover:bg-[#fee9e1] active:bg-[#c0fdfb] flex justify-center items-center ">
                          {" "}
                          <IoMdHeartEmpty className="text-black/70 text-2xl" />
                        </button>
                      </li>
                    </NavigationMenuTrigger>
                    {pathname !== "/show-listing" && (
                      <NavigationMenuContent className="custom-scrollbar text-black/80 flex flex-col gap-2 w-auto max-h-64  overflow-y-scroll">
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
                              class="block whitespace-nowrap hover:bg-white px-4 py-2"
                            >
                              <div className="flex gap-2 items-center ">
                                <img
                                  src={listing.imageURLS[0]}
                                  alt="cover image"
                                  className="h-14 w-14 rounded-md"
                                />
                                <div className="flex flex-col text-sm">
                                  <p className="block whitespace-nowrap">
                                    ${listing.regularPrice}
                                  </p>
                                  <p className="block whitespace-nowrap">
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
                      className={`flex gap-2 ${
                        pathname === "/profile" ? "border border-dotted" : ""
                      }`}
                    >
                      <Link to="/profile">
                        <img
                          className="rounded-full w-9 h-9 object-cover"
                          src={currentUser.avatar}
                          alt="profile picture"
                        />
                      </Link>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className=" text-black/80 flex flex-col gap-2 ">
                      <NavigationMenuLink class="block whitespace-nowrap hover:bg-white px-4 py-2 ">
                        <Link to="/profile">Profile</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block whitespace-nowrap hover:bg-white px-4 py-2">
                        <Link to="/create-listing">Create Listing</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block whitespace-nowrap hover:bg-white px-4 py-2">
                        <Link to="/show-listing">My Listings</Link>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <Link to="/sign-in">
                <li className=" sm:inline text-slate-700 hover:underline">
                  <button className="border border-black/60 capitalize bg-[#fcd5ce] py-1 px-4  rounded-full hover:bg-[#fee9e1] active:bg-[#c0fdfb]">
                    Sign in
                  </button>
                </li>
              </Link>
            )}
          </ul>
        </div>
      </Container>
    </header>
  );
};
