import { Link, useNavigate } from "react-router-dom";
import { GoogleAuth } from "../components/GoogleAuth";
import Container from "@/components/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signUpSuccess,
} from "@/redux/feature/user/userSlice";
import { BeatLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FaEyeSlash } from "react-icons/fa";
import { MdRemoveRedEye } from "react-icons/md";
import { useState } from "react";

export const SignUp = () => {
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      let toastId;
      if (resData.success === false) {
        console.error(`data ${resData.message}`);
        dispatch(signInFailure("Signup failed please try again"));
        if (resData.message.includes("duplicate key error")) {
          const errorMessage = resData.message;
          const regex = /dup key: \{ (.+?): "(.+?)" \}/;
          const match = errorMessage.match(regex);

          if (match && match[1] === "username") {
            toastId = toast.dismiss(toastId);
            toastId = toast.error(
              `The username ${match[2]} is already taken please try another`,
              {
                duration: Infinity,
              }
            );
          } else if (match && match[1] === "email") {
            toastId = toast.dismiss(toastId);

            toastId = toast.error(
              `Account with email ${match[2]} already exist please try another or signin with the email`,
              {
                duration: Infinity,
              }
            );
          } else {
            toastId = toast.dismiss(toastId);
            toast.error("Signin failed please try again!");
          }
        } else {
          toast.dismiss(toastId);
          toast.error("Signin failed please try again!");
        }

        return;
      }
      dispatch(signUpSuccess());
      navigate("/sign-in");
      toast.dismiss(toastId);
      toast.success("Signup successful!");
    } catch (error) {
      dispatch(signInFailure("Signup failed please try again"));
      console.error(error.message);
      toast.error("Signin failed please try again!");
    }
  };

  return (
    <Container>
      <div className="p-3 max-w-lg mx-auto border border-black/30 rounded-lg my-7 shadow-md shadow-gray-500">
        {" "}
        <h1 className="text-xl text-slate-700 md:text-3xl text-center font-semibold my-7">
          Sign Up
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 "
        >
          <input
            type="text"
            placeholder="username"
            className="border font-normal p-2 placeholder:text-lg md:placeholder:text-xl   md:p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20
          "
            {...register("username", { required: "username is required " })}
          />
          {errors.username && (
            <p className="text-red-500 text-sm py-1">
              {errors.username.message}
            </p>
          )}
          <input
            type="email"
            placeholder="email"
            className="border font-normal p-2 placeholder:text-lg md:placeholder:text-xl   md:p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
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
              className="border font-normal p-2 placeholder:text-lg md:placeholder:text-xl   md:p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 w-full"
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
            <p className="text-red-500 text-sm py-1">
              {errors.password.message}
            </p>
          )}
          <button
            disabled={loading}
            className="border border-black/60 capitalize bg-[#1f2937] p-3 rounded-md hover:opacity-90 cursor-pointer text-white text-lg md:text-xl lg:text-2xl"
          >
            {loading ? (
              <BeatLoader color="white" size={15} speedMultiplier={0.4} />
            ) : (
              "Sign up"
            )}
          </button>
          <GoogleAuth />
        </form>
        <div className="flex text-slate-700 text-md gap-2 mt-5">
          <p>Have an account?</p>
          <Link to="/sign-in">
            <span className="text-blue-700">Sign in</span>
          </Link>
        </div>
      </div>
    </Container>
  );
};
