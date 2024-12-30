const ContactDeveloperForm = () => {
  return (
    <>
      <div className="p-4 border border-black/60 shadow-md shadow-gray-500 rounded-lg bg-[#d8e2dc] w-full   flex-col ">
        <p className="text-center text-lg py-4"> More about this property</p>
        <form className=" flex flex-col  flex-shrink-0 justify-center  gap-6 ">
          <div className="relative ">
            <input
              name="fullName"
              type="text"
              id="fullName"
              className="border peer placeholder-transparent border-slate-800 p-2 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 w-full"
              placeholder="Enter full name"
            />
            <label
              htmlFor="fullName"
              className="bg-gray-50  rounded-tl-md rounded-tr-md px-3 absolute left-5 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac]peer-focus:text-lg  peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2"
            >
              Full Name
            </label>
          </div>
          <div className="relative">
            <input
              name="email"
              type="email"
              id="email"
              className="border peer placeholder-transparent border-slate-800 p-2 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 w-full"
              placeholder="Enter your email"
            />
            <label
              htmlFor="email"
              className="bg-gray-50  rounded-tl-md rounded-tr-md px-3 absolute left-5 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac]peer-focus:text-lg  peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2"
            >
              Email
            </label>
          </div>
          <div className="relative ">
            <input
              name="phone"
              type="text"
              id="phone"
              className="border peer placeholder-transparent border-slate-800 p-2 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 w-full"
              placeholder="Enter phone number"
            />
            <label
              htmlFor="phone"
              className="bg-gray-50  rounded-tl-md rounded-tr-md px-3 absolute left-5 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac]peer-focus:text-lg  peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2"
            >
              Phone Number
            </label>
          </div>
          <div className="relative">
            <textarea
              name="message"
              id="message"
              className="w-full border peer focus:placeholder-transparent border-slate-800 p-2 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 text-xl"
              placeholder="please provide how contacting developer helps you"
              cols={8}
              rows={3}
            ></textarea>
            <label
              htmlFor="message"
              className="bg-gray-50  rounded-tl-md rounded-tr-md px-3 absolute left-5 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac]peer-focus:text-lg  
                        "
            >
              Message
            </label>
          </div>
          <button className="p-3 background text-white text-lg rounded-full capitalize bg-[#b09e99] hover:bg-[#c9b2ac] active:bg-[#c0fdfb] ">
            Contact developer
          </button>
        </form>
      </div>
    </>
  );
};

export default ContactDeveloperForm;
