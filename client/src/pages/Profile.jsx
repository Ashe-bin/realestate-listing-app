import { useSelector } from "react-redux";
import { supabase } from "../supabase";
import { useEffect, useRef, useState } from "react";
export const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [uploading, setUploading] = useState(false);
  const [errorUploading, setErrorUploading] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const imgRef = useRef(null);

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
      const fileExt = imageFile.name.split(".").pop().toLowerCase();
      const fileName = `${new Date().getTime()}-${imageFile.name}.${fileExt}`;
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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
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
          {console.log("errr", errorUploading)}
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
          placeholder="text"
          id="text"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};
