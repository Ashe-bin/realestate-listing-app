import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/feature/user/userSlice";
import { useNavigate } from "react-router-dom";
import { GoogleIcon } from "./Icons/icons";
import toast from "react-hot-toast";

export const GoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      toast.success("Sign in successful");
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <button
      onClick={handleGoogleAuth}
      type="button"
      className="disabled:opacity-80 disabled:cursor-not-allowed p-3 font-semibold  background text-zinc-600 text-2xl rounded-xl  capitalize bg-gradient-to-r from-red-200 via-white/60 to-green-300 hover:bg-[#c9b2ac] active:bg-[#c0fdfb] w-full border border-black/50 mx-autotext-lg md:text-xl lg:text-2xl flex justify-center items-center gap-2"
    >
      <span className="">
        {" "}
        <GoogleIcon />
      </span>
      <span> Google</span>
    </button>
  );
};
