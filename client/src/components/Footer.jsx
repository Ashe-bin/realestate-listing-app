import { Link } from "react-router-dom";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "./Icons/icons";

const Footer = () => {
  return (
    <div
      className="bg-[#b09e99] px-3  py-5  flex  justify-center   items-center gap-4 lg:gap-20 border  "
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(128, 128, 128, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(128, 128, 128, 0.1) 1px, transparent 1px)",
        backgroundSize: "14px 14px",
      }}
    >
      <div className="flex flex-col items-center  sm:items-center   md:flex-row  justify-center gap-5 flex-wrap flex-1  sm:basis-1/2  ">
        <Link to={""}>
          <div className=" hover:p-1 hover:bg-black/60   border-black/50 p-[2px]  rounded-full transition-all duration-700">
            <div className="  transition-all duration-500  bg-white/70 hover:bg-white border rounded-full  ">
              <FacebookIcon />
            </div>
          </div>
        </Link>
        <Link to={""}>
          <div className=" hover:p-1 hover:bg-black/60   border-black/50 p-[2px]  rounded-full transition-all duration-700">
            <div className="p-[3px] hover:p-[1px] transition-all duration-500  bg-white/70 hover:bg-white border rounded-full  ">
              <InstagramIcon />
            </div>
          </div>
        </Link>
        <Link to={""}>
          <div className=" hover:p-1 hover:bg-black/60   border-black/50 p-[2px]  rounded-full transition-all duration-700">
            <div className="p-[5px] hover:p-[1px] transition-all duration-500  bg-white/70 hover:bg-white border rounded-full  ">
              <LinkedinIcon />
            </div>
          </div>
        </Link>
        <Link>
          <div className=" hover:p-1 hover:bg-black/60   border-black/50 p-[2px]  rounded-full transition-all duration-700">
            <div className="p-[8px] hover:p-[1px] transition-all duration-500  bg-white/70 hover:bg-white border rounded-full  ">
              <TwitterIcon />
            </div>
          </div>
        </Link>
      </div>
      <div className="sm:flex flex-1 basis-1/2">
        <div className="text-black/70 ">
          <h3 className=" inline-block  py-1 px-2  rounded-xl  text-xl sm:text-2xl   font-semibold mb-4 border border-white/30 shadow-sm shadow-gray-500">
            Contact us
          </h3>
          <p className="mb-2 italic sm:text-lg">
            <strong className="text-xl border border-white/30 shadow-sm shadow-gray-500 inline-block rounded-xl  py-1 px-2  my-1">
              Address
            </strong>
            <br />
            1234 Elm Street, Apt 5B, Springfield, IL 62701, United States
          </p>
          <p className="mb-2 italic sm:text-lg">
            <strong className="text-xl border border-white/30 shadow-sm shadow-gray-500 inline-block rounded-xl  py-1 px-2  my-1">
              Phone
            </strong>
            <br />
            (555) 123-4567
          </p>
          <p className="mb-2 italic sm:text-lg">
            <strong className="text-xl border border-white/30 shadow-sm shadow-gray-500 inline-block rounded-xl  py-1 px-2 my-1">
              Email
            </strong>
            <br />
            info@real-estate@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
