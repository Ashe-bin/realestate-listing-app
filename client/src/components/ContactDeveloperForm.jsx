import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";

const ContactDeveloperForm = ({ listing }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [formData, setFormData] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const onSubmit = (data) => {
    setFormData(data);
    setIsOpenDialog(true);
    reset();
  };
  return (
    <>
      <div className="p-4 border border-black/60 shadow-md shadow-gray-500 rounded-lg bg-[#d8e2dc] w-full   flex-col font-normal ">
        <p className="text-center text-lg py-4"> More about this property</p>
        <form className="  " onSubmit={handleSubmit(onSubmit)}>
          <div className="max-w-[30rem] flex flex-col  flex-shrink-0 justify-center text-center mx-auto  gap-6">
            <div className="relative ">
              <input
                name="fullName"
                type="text"
                id="fullName"
                minLength={5}
                className="border peer placeholder-transparent border-slate-800 p-2 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 w-full"
                placeholder="Enter full name"
                {...register("fullName", { required: "full name is required" })}
              />
              <label
                htmlFor="fullName"
                className="bg-gray-50  rounded-tl-md rounded-tr-md px-3 absolute left-5 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac]peer-focus:text-lg  peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2"
              >
                Full Name
              </label>
              {errors.fullName && (
                <p className="text-red-500 text-sm py-1">
                  {errors.fullName.message}
                </p>
              )}{" "}
            </div>
            <div className="relative">
              <input
                name="email"
                type="text"
                id="email"
                className="border peer placeholder-transparent border-slate-800 p-2 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 w-full"
                placeholder="Enter your email"
                {...register("email", {
                  required: "email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              <label
                htmlFor="email"
                className="bg-gray-50  rounded-tl-md rounded-tr-md px-3 absolute left-5 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac]peer-focus:text-lg  peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2"
              >
                Email
              </label>
              {errors.email && (
                <p className="text-red-500 text-sm py-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="relative ">
              <input
                name="phone"
                type="text"
                id="phone"
                className="border peer placeholder-transparent border-slate-800 p-2 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 w-full"
                placeholder="Enter phone number"
                {...register("phoneNumber", {
                  required: "phone number is required",
                  pattern: {
                    value: /^\+?\d+$/,
                    message:
                      "phone number can only include number and + to specify country code",
                  },
                })}
              />
              <label
                htmlFor="phone"
                className="bg-gray-50  rounded-tl-md rounded-tr-md px-3 absolute left-5 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac]peer-focus:text-lg  peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2"
              >
                Phone Number
              </label>
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm py-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="relative">
              <textarea
                name="message"
                id="message"
                className="w-full border peer focus:placeholder-transparent border-slate-800 p-2 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 text-xl placeholder:text-md"
                placeholder="please provide how contacting developer helps you"
                cols={8}
                rows={3}
                {...register("message", {
                  required: "text message is required",
                })}
              ></textarea>
              <label
                htmlFor="message"
                className="bg-gray-50  rounded-tl-md rounded-tr-md px-3 absolute left-5 -top-[1.2rem] text-[#64b6ac] text-sm transition-all duration-500 peer-focus:text-[#64b6ac]peer-focus:text-lg  
                        "
              >
                Message
              </label>
              {errors.message && (
                <p className="text-red-500 text-sm py-1">
                  {errors.message.message}
                </p>
              )}
            </div>
            <button
              disabled={currentUser._id === listing.userRef}
              title={
                currentUser._id === listing.userRef
                  ? "This is your own listing, you can not do this action"
                  : ""
              }
              className="p-3 font-semibold background text-zinc-600 text-xl rounded-xl  capitalize bg-gradient-to-r from-teal-200 via-white/60 to-black/30 hover:bg-[#c9b2ac] active:bg-[#c0fdfb] w-[80%] border border-black/50 mx-auto  disabled:cursor-not-allowed"
            >
              Contact developer
            </button>
          </div>
        </form>
      </div>
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message Sent Successfully</DialogTitle>
            <DialogDescription>Message sent to the developer</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify center gap-2 text-slate-700 text-lg text-left">
            <div>your message is sent to the developer</div>
            <div>
              developer will contact you via your email
              <span className="font-semibold italic"> {formData?.email} </span>
              or via your phone number
              <span className="font-semibold italic">
                {" "}
                {formData?.phoneNumber}{" "}
              </span>
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
    </>
  );
};

export default ContactDeveloperForm;
