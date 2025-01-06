import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  updateStart,
  updateFailure,
  updateSuccess,
  deleteUserFailure,
  deleteUserSuccess,
  signoutFailure,
  signout,
} from "../redux/feature/user/userSlice";
import Container from "@/components/Container";
import UploadWidget from "@/components/uploadWidget";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

export const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imgURL, setImgURL] = useState(null);
  const imgRef = useRef(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSignout, setIsSignout] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleComplete = (error, result) => {
    setUploadingImage(true);
    if (error) {
      console.error("upload failed:", error);
      toast.error("Could not upload image please try again");
    } else if (result) {
      console.log("update successful:", result);
      setImgURL(result.publicURL);
      setFormData((prev) => ({ ...prev, avatar: result.publicURL }));
      toast.success("Image upload successful");
    }
    setUploadingImage(false);
  };
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    dispatch(updateStart());

    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateFailure(data.message));
        toast.error("Failed to update your profile, please try again");
        console.error(error);
        return;
      }
      dispatch(updateSuccess(data));
      toast.success("Profile updated successfully");
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error("Failed to update your profile, please try again");
      console.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/user/delete-user/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        toast.error("Could not delete account, please try again");
        return;
      }

      navigate("/sign-up");
      dispatch(deleteUserSuccess());
      localStorage.clear();
      toast.success("Account deleted successfully");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error("Could not delete account, please try again");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignout = async () => {
    setIsSignout(true);

    try {
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutFailure(data.message));
        toast.error("Could not signout please try again");
        return;
      }
      localStorage.clear();
      dispatch(signout());
      toast.success("Signout successful");
      navigate("/sign-in");
    } catch (error) {
      dispatch(signoutFailure(error.message));
      toast.error("Could not signout please try again");
    } finally {
      setIsSignout(false);
    }
  };

  return (
    <Container>
      <div className="p-3 max-w-lg mx-auto border border-black/30 rounded-lg my-7 shadow-md shadow-gray-500">
        <h1 className="text-xl lg:text-3xl text-slate-700 font-semibold text-center">
          Profile
        </h1>
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-4 text-gray-700"
        >
          <div className="relative self-center group mt-5  rounded-full overflow-clip border border-black/30 ">
            <img
              src={imgURL || currentUser.avatar}
              onClick={() => imgRef.current.click()}
              alt="profile picture"
              className={`${
                uploadingImage ? "animate-pulse" : ""
              } h-24 w-24 object-cover cursor-pointer  `}
            />
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity text-nowrap">
              Click to Change profile picture
            </div>
          </div>
          <div className=" text-center">
            <div className=" self-center">
              <UploadWidget
                disabled={loading}
                onComplete={handleComplete}
                button={"update profile picture"}
                className="bg-[#b09e99] cursor-pointer p-1 rounded-md text-white border border-black/20"
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="username"
            defaultValue={currentUser.username}
            id="username"
            className="border font-normal p-2 placeholder:text-sm md:placeholder:text-md   md:p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
            onChange={changeHandler}
          />
          <input
            type="email"
            placeholder="email"
            defaultValue={currentUser.email}
            id="email"
            className="border font-normal p-2 placeholder:text-sm md:placeholder:text-md   md:p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
            onChange={changeHandler}
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            className="border font-normal p-2 placeholder:text-sm md:placeholder:text-md   md:p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
            onChange={changeHandler}
          />
          <button
            disabled={loading}
            className="bg-[#b09e99] font-semibold text-lg text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 border border-black/60"
          >
            {isUpdating ? (
              <BeatLoader color="white" size={15} speedMultiplier={0.4} />
            ) : (
              "update"
            )}
          </button>
        </form>
        <div className="flex gap-4 flex-wrap justify-center sm:justify-between mt-5">
          <button
            disabled={loading}
            className="border border-black/60 capitalize bg-red-500 py-1 px-4  rounded-md hover:bg-red-400 active:bg-[#c0fdfb]"
            onClick={handleDelete}
          >
            {isDeleting ? (
              <BeatLoader color="white" size={15} speedMultiplier={0.4} />
            ) : (
              "Delete account"
            )}
          </button>
          <button
            disabled={loading}
            className="border border-black/60 capitalize bg-[#64b6ac] py-1 px-4  rounded-md hover:bg-[#85eade]  active:bg-[#c0fdfb] cursor-pointer"
            onClick={handleSignout}
          >
            {isSignout ? (
              <BeatLoader color="white" size={15} speedMultiplier={0.4} />
            ) : (
              "Sign out"
            )}
          </button>
        </div>
      </div>
    </Container>
  );
};
