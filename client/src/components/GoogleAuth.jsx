import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/feature/user/userSlice";
import { useNavigate } from "react-router-dom";

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
      console.log(error.message);
    }
  };
  return (
    <button
      onClick={handleGoogleAuth}
      type="button"
      className="border border-black/60 capitalize bg-[#FAD2CF]
          
         transition-all duration-300 p-3 rounded-md hover:opacity-90 active:bg-[#c0fdfb] cursor-pointer text-slate-700 text-lg md:text-xl lg:text-2xl"
    >
      Continue with google
    </button>
  );
};
