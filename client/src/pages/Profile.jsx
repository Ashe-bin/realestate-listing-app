import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
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
  updateProfilePic,
} from "../redux/feature/user/userSlice";
import Container from "@/components/Container";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { resetLiked } from "@/redux/feature/user/userLikedListSlice";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";

export const Profile = () => {
  const {
    cloudinaryImgUpload,
    imgUploading,
    setUploadedImgURL,
    uploadError,
    uploadedImgURL,
  } = useCloudinaryUpload();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [imgURL, setImgURL] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSignout, setIsSignout] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (uploadError) {
      console.error("upload failed:", uploadError);
      setUploadedImgURL([]);
      toast.error("Could not upload image please try again");
    } else if (uploadedImgURL.length > 0) {
      setImgURL(uploadedImgURL[0]);
      toast.success("Image upload successful");
      dispatch(updateProfilePic(uploadedImgURL[0]));
      setUploadedImgURL([]);
    }
  }, [uploadError, uploadedImgURL, setUploadedImgURL, dispatch]);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  console.log("formdaata", formData);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (imgURL) {
      setFormData((prev) => ({ ...prev, avatar: imgURL }));
    }

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
      dispatch(resetLiked());
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
      dispatch(resetLiked());
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
              src={currentUser.avatar}
              alt="profile picture"
              className={`${
                imgUploading ? "animate-pulse" : ""
              } h-24 w-24 object-center aspect-square cursor-pointer  `}
            />
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity text-nowrap">
              Click to Change profile picture
            </div>
          </div>
          <div className=" text-center">
            <div
              className="self-center inline-block  capitalize bg-[#b09e99] cursor-pointer p-1 rounded-md text-white border border-black/20"
              onClick={cloudinaryImgUpload}
            >
              update profile picture
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
            disabled={loading || imgUploading}
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
            disabled={loading || imgUploading}
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
            disabled={loading || imgUploading}
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
