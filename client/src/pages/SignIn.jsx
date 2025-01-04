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

export const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    dispatch(signInStart());

    if (data) {
      setTimeout(() => {
        dispatch(signInSuccess());
      }, 3000);
      return;
    }
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
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
          <input
            type="password"
            placeholder="password"
            className="border  font-normal p-2 placeholder:text-lg md:placeholder:text-xl  md:p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
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
          {errors.password && (
            <p className="text-red-500 text-sm my-1">
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
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </Container>
  );
};
