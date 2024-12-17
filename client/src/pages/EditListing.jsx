import { useEffect, useState } from "react";
import useImagePreview from "../hooks/useImagePreview";
import { AiOutlineClose } from "react-icons/ai";
import { supabase } from "../supabase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const EditListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { error, handleImageChange, selectedFile, setSelectedFile } =
    useImagePreview();
  const [imageFile, setImageFile] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [creatingList, setCreatingList] = useState(false);
  const [createListError, setCreateListError] = useState(null);
  const [uploadingError, setUploadingError] = useState(null);
  const [initialExtracted, setInitialExtracted] = useState([]);
  const navigate = useNavigate();
  const { listingId } = useParams();

  const [formData, setFormData] = useState({
    imageURLS: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedRoom: 1,
    bathRoom: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      console.log("started execution");

      try {
        const res = await fetch(`/api/listing/getListing/${listingId}`);
        const data = await res.json();
        console.log("started data", data);

        if (data.success === false) {
          throw new Error(`fetching list error ${data}`);
        }
        setFormData(data);
        setInitialExtracted(data.imageURLS);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [listingId]);

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

        const { data, error } = await supabase.storage
          .from("image-storage") // Replace with your bucket name
          .upload(fileName, file);

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
        } = supabase.storage.from("image-storage").getPublicUrl(fileName);

        if (!publicUrl) {
          setUploadingError("Image upload failed, try again");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          imageURLS: [...prev.imageURLS, publicUrl],
        }));
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

  console.log("formdata", formData);
  console.log(formData.imageURLS);
  const handleDeleteImg = (index) => {
    setSelectedFile((prevFiles) => prevFiles.filter((_, idx) => idx !== index));
    setImageFile((prevFiles) => prevFiles.filter((_, idx) => idx !== index));
  };
  const handleDeleteImgFetched = (imgurl) => {
    setInitialExtracted((prev) => prev.filter((img) => img !== imgurl));
    setFormData((prev) => ({
      ...prev,
      imageURLS: prev.imageURLS.filter((img) => img !== imgurl),
    }));
  };
  const handleFormChange = (e) => {
    const { id, name, type, checked, value } = e.target;

    if (name === "type") {
      setFormData((prev) => ({ ...prev, type: id }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateListError(true);
    setCreateListError(null);
    if (formData.imageURLS.length === 0) {
      setCreateListError("Please enter images to create listing");
      return;
    }
    if (+formData.regularPrice <= +formData.discountPrice) {
      setCreateListError("discount can not be greater than regular price");
      return;
    }

    try {
      const res = await fetch(`/api/listing/edit/${listingId}`, {
        method: "POST",
        headers: { "Content-Type": "Application/JSON" },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();

      if (data.success === false) {
        setCreateListError("Create list failed, try again");
        return;
      }
      setFormData(data);
      setInitialExtracted(data.imageURLS);
      setSelectedFile(null);
      setImageFile(null);
    } catch (error) {
      setCreateListError("Create list failed, try again");
      console.error(error.message);
    } finally {
      setCreatingList(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-10"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            onChange={handleFormChange}
            value={formData.name}
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            onChange={handleFormChange}
            value={formData.description}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            onChange={handleFormChange}
            value={formData.address}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleFormChange}
                checked={formData.type === "sale"}
                id="sale"
                name="type"
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleFormChange}
                checked={formData.type === "rent"}
                type="checkbox"
                name="type"
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleFormChange}
                checked={formData.parking}
                type="checkbox"
                id="parking"
                className="w-5"
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleFormChange}
                checked={formData.furnished}
                type="checkbox"
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleFormChange}
                checked={formData.offer}
                type="checkbox"
                id="offer"
                className="w-5"
              />
              <span>you have Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedRoom"
                onChange={handleFormChange}
                value={formData.bedRoom}
                min="1"
                max="100"
                required
                className="p-3 border border-gray-300 rounded-lg "
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathRoom"
                min="0"
                onChange={handleFormChange}
                value={formData.bathRoom}
                max="50"
                required
                className="p-3 border border-gray-300 rounded-lg "
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                onChange={handleFormChange}
                value={formData.regularPrice}
                min="0"
                required
                className="p-3 border border-gray-300 rounded-lg "
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="1"
                  onChange={handleFormChange}
                  value={formData.discountPrice}
                  required
                  className="p-3 border border-gray-300 rounded-lg "
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
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
          {initialExtracted &&
            initialExtracted.map((img, idx) => (
              <div
                key={idx}
                className="relative flex justify-center items-center overflow-hidden rounded-lg my-1"
              >
                <img
                  src={img}
                  alt="listing-image"
                  className="object-cover overflow-clip w-full h-80 self-center rounded-lg transition-transform duration-700 ease-in-out hover:scale-110"
                />
                <AiOutlineClose
                  onClick={() => handleDeleteImgFetched(img)}
                  className="bg-white text-black rounded-full p-1 size-6 font-bold absolute top-1 right-1 hover:text-white hover:p-2 hover:bg-red-700 transition duration-300 ease-in-out"
                />
              </div>
            ))}
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

          <button
            disabled={creatingList || isUploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {creatingList ? "Updating..." : "Update Listing"}
          </button>
          {createListError && (
            <p className="text-sm text-red-700 text-center">
              {createListError}
            </p>
          )}
        </div>
      </form>
    </main>
  );
};

export default EditListing;
