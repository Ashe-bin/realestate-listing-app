import { useSelector } from "react-redux";
import { supabase } from "../supabase";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  updateStart,
  updateFailure,
  updateSuccess,
  deleteUserFailure,
  deleteUserSuccess,
  signoutFailure,
  signout,
} from "../redux/feature/user/userSlice";
export const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [uploading, setUploading] = useState(false);
  const [errorUploading, setErrorUploading] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const imgRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [updateInfo, setUpdateInfo] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (imageFile) {
      handleImageUpload(imageFile);
    }
  }, [imageFile]);

  const handleImageUpload = async (imageFile) => {
    setUploading(true);
    const imageFileSize = 2 * 1024 * 1024;
    try {
      if (imageFile.size > imageFileSize) {
        setErrorUploading("Image file should be less than 2MB");
        setImageFile(null);
        return;
      }

      const fileName = `${Date().now()}-${imageFile.name}`;
      const { data, error } = await supabase.storage
        .from("image-storage") // Replace with your bucket name
        .upload(fileName, imageFile);
      if (error) {
        setErrorUploading("Image upload failed, try again");
        setImageFile(null);
        return;
      }
      if (!data) {
        setErrorUploading("Image upload failed, try again");
        setImageFile(null);
        return;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("image-storage").getPublicUrl(fileName);
      if (!publicUrl) {
        setErrorUploading("Image upload failed, try again");
        setImageFile(null);
        return;
      }
      setImgURL(publicUrl);
      setFormData({ avatar: publicUrl });
    } catch (error) {
      console.error(error.message);
      setErrorUploading("Image upload failed try again");
      setImageFile(null);
    } finally {
      setUploading(false);
      setTimeout(() => {
        setErrorUploading("");
      }, 3000);
    }
  };
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
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
        return;
      }
      dispatch(updateSuccess(data));
      setUpdateInfo(true);
    } catch (error) {
      dispatch(updateFailure(error.message));
    } finally {
      setTimeout(() => {
        setUpdateInfo(false);
      }, 3000);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/user/delete-user/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      setDeleteUser(true);

      setTimeout(() => {
        navigate("/sign-up");
        dispatch(deleteUserSuccess());
      }, 3000);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    } finally {
      setTimeout(() => {
        setDeleteUser(false);
      }, 3000);
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/auth/signout`);

      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutFailure(data.message));
        return;
      }
      dispatch(signout());
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto border border-black/30 rounded-lg my-7 shadow-md shadow-gray-500">
      <h1 className="text-3xl font-semibold text-center">Profile</h1>
      <form
        onSubmit={submitHandler}
        className="flex flex-col gap-4 text-gray-700"
      >
        <input
          onChange={(e) => setImageFile(e.target.files[0])}
          type="file"
          ref={imgRef}
          accept="image/"
          className="hidden"
        />
        <img
          src={imgURL || currentUser.avatar}
          onClick={() => imgRef.current.click()}
          alt="profile picture"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {errorUploading ? (
            <p className=" text-red-700">{errorUploading}</p>
          ) : uploading ? (
            <p className="animate-pulse">Uploading image...</p>
          ) : imgURL ? (
            <p className=" text-green-700">Image uploaded successfully</p>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={changeHandler}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={changeHandler}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={changeHandler}
        />
        <button
          disabled={loading}
          className="bg-[#b09e99] font-semibold text-lg text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 border border-black/60"
        >
          {loading
            ? "Updating.."
            : updateInfo
            ? "Updated Successfully"
            : "update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <button
          className="border border-black/60 capitalize bg-red-500 py-1 px-4  rounded-md hover:bg-red-400 active:bg-[#c0fdfb]"
          onClick={handleDelete}
        >
          {deleteUser ? "Deleted successfully" : "Delete account"}
        </button>
        <button
          className="border border-black/60 capitalize bg-[#64b6ac] py-1 px-4  rounded-md hover:bg-[#85eade] active:bg-[#c0fdfb]"
          onClick={handleSignout}
        >
          Sign out
        </button>
      </div>
      <p className="text-center text-red-700 mt-2">{error ? error : ""}</p>
    </div>
  );
};
