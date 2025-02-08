import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/feature/user/userSlice";
import { GoogleAuth } from "../components/GoogleAuth";
import Container from "@/components/Container";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FaEyeSlash } from "react-icons/fa";
import { MdRemoveRedEye } from "react-icons/md";
import { useState } from "react";

export const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const onSubmit = async (data) => {
    dispatch(signInStart());

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData.success === false) {
        dispatch(signInFailure(data.message));
        toast.error("Account not found, please signup");
        console.error(resData);

        return;
      }
      dispatch(signInSuccess(resData));
      toast.success("Signin successful!");

      navigate("/");
    } catch (error) {
      toast.error("Signin failed please try again!");
      console.error(error.message);
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <Container>
      <div className="p-3 max-w-lg mx-auto border border-black/30 rounded-lg my-7 shadow-md shadow-gray-500">
        {" "}
        <h1 className="text-xl text-slate-700 md:text-3xl text-center font-semibold my-7">
          Sign In
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="email"
            className="border font-normal p-2 placeholder:text-lg md:placeholder:text-xl    md:p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm py-1">{errors.email.message}</p>
          )}
          <div className="relative flex w-full">
            <input
              type={isPasswordHidden ? "password" : "text"}
              placeholder="password"
              className="border  font-normal p-2 placeholder:text-lg md:placeholder:text-xl  md:p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 w-full"
              {...register("password", {
                required: "password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "password must be at least 8 characters, include  capital letter, small letter, number, and special symbol",
                },
              })}
            />
            <div
              className="absolute  right-4 top-[0.7rem]"
              onClick={() => setIsPasswordHidden((prev) => !prev)}
            >
              {isPasswordHidden ? (
                <MdRemoveRedEye className="size-5" />
              ) : (
                <FaEyeSlash className="size-5" />
              )}
            </div>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm my-1">
              {errors.password.message}
            </p>
          )}
          <button
            disabled={loading}
            className="disabled:opacity-80 disabled:cursor-not-allowed p-3 font-semibold  background text-zinc-600 text-2xl rounded-xl  capitalize bg-gradient-to-r from-teal-200 via-white/60 to-black/50 hover:bg-[#c9b2ac] active:bg-[#c0fdfb] w-full  border border-black/50 mx-auto"
          >
            {loading ? (
              <BeatLoader color="white" size={15} speedMultiplier={0.4} />
            ) : (
              "Sign in"
            )}
          </button>
          <GoogleAuth />
        </form>
        <div className="flex text-slate-700 text-md gap-2 mt-5">
          <p>Don&apos;t have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-700">Sign up</span>
          </Link>
        </div>
      </div>
    </Container>
  );
};
