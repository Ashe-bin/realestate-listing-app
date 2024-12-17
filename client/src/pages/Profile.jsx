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
  const [userListing, setUserListing] = useState([]);
  const dispatch = useDispatch();
  const [showListingError, setShowListingError] = useState(false);
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
  console.log(formData);
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
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
    console.log("start delete");
    try {
      const res = await fetch(`/api/user/delete-user/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log("data", data);
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

  const handleShowListing = async () => {
    setShowListingError(false);
    try {
      const res = await fetch(`/api/user/listing/${currentUser._id}`);

      const data = await res.json();

      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      console.log("data", data);

      setUserListing(data);
    } catch (error) {
      console.error(error.message);
      setShowListingError(true);
    }
  };

  const handleDeleteList = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        console.error(`error deleting  ${data}`);
        return;
      }

      setUserListing((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
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
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading
            ? "Updating.."
            : updateInfo
            ? "Updated Successfully"
            : "update"}
        </button>

        <button
          type="button"
          className="  bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          <Link to={"/create-listing"}>Create Listing</Link>
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <button className="text-red-700 cursor-pointer" onClick={handleDelete}>
          {deleteUser ? "Deleted successfully" : "Delete account"}
        </button>
        <button onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign out
        </button>
      </div>
      <p className="text-center text-red-700 mt-2">{error ? error : ""}</p>
      <button onClick={handleShowListing} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-center text-red-600 my-2">
        {showListingError ? "Error showing listing" : ""}
      </p>
      {console.log("userlisting", userListing)}
      {userListing && userListing.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl">Your Listings</h1>
          {userListing.map((listing) => (
            <div
              key={listing._id}
              className=" border border-red-700 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageURLS[0]}
                  alt="listing cover"
                  className="h-24 w-24 object-cover"
                />
              </Link>
              <Link
                className="text-slate-700 flex-1 hover:underline truncate"
                to={`{listing/${listing._id}}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleDeleteList(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <button className="text-green-700 uppercase">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
