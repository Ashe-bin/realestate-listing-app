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
      className="bg-[#b09e99] px-3  py-5  flex  justify-center  items-center gap-4 lg:gap-20 border "
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(128, 128, 128, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(128, 128, 128, 0.1) 1px, transparent 1px)",
        backgroundSize: "14px 14px",
      }}
    >
      <div className="flex flex-col sm:flex-row gap-5 flex-wrap">
        <Link to={""}>
          <div className=" hover:p-1 hover:bg-black/60   border-black/50 p-[2px]  rounded-full transition-all duration-700">
            <div className="p-1 hover:p-[1px] transition-all duration-500  bg-white/70 hover:bg-white border rounded-full  ">
              <FacebookIcon />
            </div>
          </div>
        </Link>
        <Link to={""}>
          <div className=" hover:p-1 hover:bg-black/60   border-black/50 p-[2px]  rounded-full transition-all duration-700">
            <div className="p-1 hover:p-[1px] transition-all duration-500  bg-white/70 hover:bg-white border rounded-full  ">
              <InstagramIcon />
            </div>
          </div>
        </Link>
        <Link to={""}>
          <div className=" hover:p-1 hover:bg-black/60   border-black/50 p-[2px]  rounded-full transition-all duration-700">
            <div className="p-1 hover:p-[1px] transition-all duration-500  bg-white/70 hover:bg-white border rounded-full  ">
              <LinkedinIcon />
            </div>
          </div>
        </Link>
        <Link>
          <div className=" hover:p-1 hover:bg-black/60   border-black/50 p-[2px]  rounded-full transition-all duration-700">
            <div className="p-1 hover:p-[1px] transition-all duration-500  bg-white/70 hover:bg-white border rounded-full  ">
              <TwitterIcon />
            </div>
          </div>
        </Link>
      </div>
      <div>
        <div className="text-black/70 ">
          <h3 className="text-lg sm:text-2xl capitalize  sm:font-semibold mb-4">
            Contact Us
          </h3>
          <p className="mb-2 italic">
            <strong className="text-lg">Address:</strong>
            <br />
            1234 Elm Street, Apt 5B, Springfield, IL 62701, United States
          </p>
          <p className="mb-2 italic">
            <strong className="text-lg">Phone:</strong>
            <br />
            (555) 123-4567
          </p>
          <p className="mb-2 italic">
            <strong className="text-lg ">Email:</strong>
            <br />
            info@real-estate@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
