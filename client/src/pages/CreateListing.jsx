import { useState } from "react";
import useImagePreview from "../hooks/useImagePreview";
import { AiOutlineClose } from "react-icons/ai";
import { supabase } from "../supabase";

const CreateListing = () => {
  const { error, handleImageChange, selectedFile, setSelectedFile } =
    useImagePreview();
  const [imageFile, setImageFile] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingError, setUploadingError] = useState(null);
  const [imgPublicUrl, setImgPublicUrl] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 6);
    setImageFile(files);
    handleImageChange(files);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      for (const file of imageFile) {
        const fileName = `${Date.now()}-${file.name}`;
        console.log("file", file);

        console.log("fileName", fileName);
        const { data, error } = await supabase.storage
          .from("listing-storage") // Replace with your bucket name
          .upload(fileName, imageFile);
        if (error) {
          setUploadingError("Image upload failed, try again");
          return;
        }
        if (!data) {
          setUploadingError("Image upload failed, try again");
          return;
        }
        const {
          data: { publicUrl },
        } = supabase.storage.from("listing-storage").getPublicUrl(fileName);

        if (!publicUrl) {
          setUploadingError("Image upload failed, try again");
          return;
        }
        console.log("public url", publicUrl);

        setImgPublicUrl((prev) => [...prev, publicUrl]);
      }
    } catch (error) {
      console.error(error.message);
      setUploadingError("Image upload failed, try again");
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadingError(null);
      }, 3000);
    }
  };
  console.log("selectefie", selectedFile);
  console.log("imgPublicUrl", imgPublicUrl);
  console.log("imagefile", imageFile);

  const handleDeleteImg = (index) => {
    setSelectedFile((prevFiles) => prevFiles.filter((_, idx) => idx !== index));
    setImageFile((prevFiles) => prevFiles.filter((_, idx) => idx !== index));
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col md:flex-row gap-10">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" defaultChecked id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                defaultValue="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg "
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                defaultValue="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg "
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg "
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg "
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover of you listing (max-6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              onChange={handleFileChange}
              multiple
            />
            <button
              type="button"
              disabled={error || imageFile.length === 0}
              className="p-3 disabled:text-gray-700 disabled:cursor-not-allowed  text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 "
              onClick={handleUpload}
            >
              {isUploading ? "uploading.." : "Upload"}
            </button>
          </div>
          {uploadingError && (
            <p className="text-center text-sm text-red-700">{uploadingError}</p>
          )}
          {selectedFile &&
            selectedFile.map((file, idx) => (
              <div
                key={idx}
                className="relative flex justify-center items-center overflow-hidden rounded-lg my-1"
              >
                <img
                  src={file}
                  alt="listing-image"
                  className="object-cover overflow-clip w-full h-80 self-center rounded-lg transition-transform duration-700 ease-in-out hover:scale-110"
                />
                <AiOutlineClose
                  onClick={() => handleDeleteImg(idx)}
                  className="bg-white text-black rounded-full p-1 size-6 font-bold absolute top-1 right-1 hover:text-white hover:p-2 hover:bg-red-700 transition duration-300 ease-in-out"
                />
              </div>
            ))}
          {error && (
            <p className="my-2 text-center self-center text-red-700">{error}</p>
          )}

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
