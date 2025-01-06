import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/feature/user/userSlice";
import { useNavigate } from "react-router-dom";
import { GoogleIcon } from "./Icons/icons";

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
      className="border border-black/60 capitalize bg-[#FAD2CF]
          
         transition-all duration-300  py-1 px-3 rounded-md hover:opacity-90 active:bg-[#c0fdfb] font-semibold cursor-pointer text-slate-800 text-lg md:text-xl lg:text-2xl flex justify-center items-center gap-2"
    >
      <span className="">
        {" "}
        <GoogleIcon />
      </span>
      <span> Google</span>
    </button>
  );
};
