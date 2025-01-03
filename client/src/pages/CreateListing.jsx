import { useState } from "react";
import useImagePreview from "../hooks/useImagePreview";
import { AiOutlineClose } from "react-icons/ai";
import { supabase } from "../supabase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Container from "@/components/Container";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { error, handleImageChange, selectedFile, setSelectedFile } =
    useImagePreview();
  const [imageFile, setImageFile] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [creatingList, setCreatingList] = useState(false);
  const [createListError, setCreateListError] = useState(null);
  const [uploadingError, setUploadingError] = useState(null);
  const navigate = useNavigate();

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
    propertyType: "",
    houseArea: 0,
    lotArea: 0,
    developedDate: "",
    propertyDetail: "",
  });

  console.log("formdata", formData);

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

  const handleDeleteImg = (index) => {
    setSelectedFile((prevFiles) => prevFiles.filter((_, idx) => idx !== index));
    setImageFile((prevFiles) => prevFiles.filter((_, idx) => idx !== index));
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
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: { "Content-Type": "Application/JSON" },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();

      if (data.success === false) {
        setCreateListError("Create list failed, try again");
        return;
      }
    } catch (error) {
      setCreateListError("Create list failed, try again");
      console.error(error.message);
    } finally {
      setCreatingList(false);
    }
  };

  return (
    <Container>
      <main className=" my-7">
        <h1 className=" text-2xl md:text-3xl text-[#083344] font-semibold text-center my-5">
          Create Listing
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col   mx-auto lg:flex-row flex-shrink-0 gap-10 "
        >
          <div className="flex flex-col gap-4 flex-1 border border-black/10 rounded-lg shadow-md shadow-gray-300 text-slate-700 font-semibold p-2 w-full md:w-[70%] mx-auto lg:basis-1/2 md:p-5">
            <input
              type="text"
              placeholder="Name of developer company/(Name of a person if individual)"
              className="border font-normal p-2 placeholder:text-sm md:placeholder:text-md   md:p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
              id="name"
              maxLength="62"
              minLength="10"
              onChange={handleFormChange}
              value={formData.name}
              required
            />
            <input
              type="text"
              placeholder="type of property (single-family,apartment, condo, townhouse...)"
              className="border font-normal p-2 placeholder:text-sm md:placeholder:text-md  md:p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
              id="propertyType"
              onChange={handleFormChange}
              value={formData.propertyType}
              required
            />
            <textarea
              type="text"
              placeholder="Short description"
              className="border font-normal p-2 placeholder:text-sm md:placeholder:text-md  md:p-3 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
              id="description"
              onChange={handleFormChange}
              value={formData.description}
              required
            />
            <textarea
              type="text"
              placeholder="property detail(modern kitchen with granite counter tops, a private backyard with a deck...)"
              className="border p-2 placeholder:text-sm md:placeholder:text-md  md:p-3 rounded-lg font-normal focus:outline-none focus:border-black focus:ring focus:ring-black/20"
              id="propertyDetail"
              onChange={handleFormChange}
              value={formData.propertyDetail}
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-2 placeholder:text-sm md:placeholder:text-md  md:p-3 rounded-lg focus:outline-none font-normal focus:border-black focus:ring focus:ring-black/20"
              id="address"
              onChange={handleFormChange}
              value={formData.address}
              required
            />
            <div className="flex-col justify-center gap-2 w-full">
              <p className="my-2">Date property developed</p>
              <input
                type="date"
                placeholder="Developed date"
                className="border focus:outline-none p-2 placeholder:text-sm md:placeholder:text-md  md:p-3 rounded-lg focus:border-black focus:ring focus:ring-black/20"
                id="developedDate"
                onChange={handleFormChange}
                value={formData.developedDate}
                required
              />{" "}
            </div>
            <div className="flex flex-col  sm:flex-row gap-6 flex-wrap">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  onChange={handleFormChange}
                  checked={formData.type === "sale"}
                  id="sale"
                  name="type"
                  className="w-6 h-6 rounded-md focus:outline-none border focus:border-black focus:ring focus:ring-black/20 checked:bg-black/60 checked:border-black/30 "
                />
                <span>Sell</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  onChange={handleFormChange}
                  checked={formData.type === "rent"}
                  type="checkbox"
                  id="rent"
                  name="type"
                  className="w-6 h-6 rounded-md focus:outline-none border focus:border-black focus:ring focus:ring-black/20 checked:bg-black/60 checked:border-black/30"
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  onChange={handleFormChange}
                  checked={formData.parking}
                  type="checkbox"
                  id="parking"
                  className="w-6 h-6 rounded-md focus:outline-none border focus:border-black focus:ring focus:ring-black/20 checked:bg-black/60 checked:border-black/30"
                />
                <span>Parking Spot</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  onChange={handleFormChange}
                  checked={formData.furnished}
                  type="checkbox"
                  id="furnished"
                  className="w-6 h-6 rounded-md focus:outline-none border focus:border-black focus:ring focus:ring-black/20 checked:bg-black/60 checked:border-black/30"
                />
                <span>Furnished</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  onChange={handleFormChange}
                  checked={formData.offer}
                  type="checkbox"
                  id="offer"
                  className="w-6 h-6 rounded-md focus:outline-none border focus:border-black focus:ring focus:ring-black/20 checked:bg-black/60 checked:border-black/30"
                />
                <span>you have Offer(discount)</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2">
                <input
                  type="number"
                  id="bedRoom"
                  onChange={handleFormChange}
                  value={formData.bedRoom}
                  min="0"
                  max="100"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 "
                />
                <p>Beds</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  type="number"
                  id="bathRoom"
                  min="0"
                  onChange={handleFormChange}
                  value={formData.bathRoom}
                  max="100"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
                />
                <p>Baths</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start  sm:items-center gap-2 ">
                <input
                  type="number"
                  id="regularPrice"
                  onChange={handleFormChange}
                  value={formData.regularPrice}
                  min="0"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
                />
                <div className="flex flex-col items-center">
                  <p>Regular Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
              {formData.offer && (
                <div className="flex flex-col sm:flex-row items-start  sm:items-center gap-2">
                  <input
                    type="number"
                    id="discountPrice"
                    min="1"
                    onChange={handleFormChange}
                    value={formData.discountPrice}
                    required
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
                  />
                  <div className="flex flex-col items-center">
                    <p>Discounted Price</p>
                    <span className="text-xs">($ / month)</span>
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  type="number"
                  id="houseArea"
                  onChange={handleFormChange}
                  value={formData.houseArea}
                  min="0"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
                />
                <div className="flex flex-col items-center">
                  <p>house square fit area(meter square)</p>
                </div>
              </div>{" "}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  type="number"
                  id="lotArea"
                  onChange={handleFormChange}
                  value={formData.lotArea}
                  min="0"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
                />
                <div className="flex flex-col items-center">
                  <p>lot square fit area(meter square)</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full md:w-[70%] mx-auto   gap-4 border border-black/10 rounded-lg p-5 flex-1 lg:basis-1/2">
            <p className="font-semibold">
              Images:{" "}
              <span className="font-normal text-gray-600 ml-2">
                The first image will be the cover of you listing (max-6)
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-col gap-2">
                <input
                  className="p-3 border border-black/30  rounded-xl w-full"
                  type="file"
                  id="images"
                  accept="image/*"
                  onChange={handleFileChange}
                  multiple
                />
              </div>
              <button
                type="button"
                disabled={error || imageFile.length === 0}
                className="p-3 disabled:text-gray-700 disabled:cursor-not-allowed  text-slate-700 border border-black/30 bg-[#64b6ac]  rounded-xl font-semibold uppercase hover:shadow-lg disabled:opacity-80 "
                onClick={handleUpload}
              >
                {isUploading ? "uploading.." : "Upload"}
              </button>
            </div>

            {uploadingError && (
              <p className="text-center text-sm text-red-700">
                {uploadingError}
              </p>
            )}
            {selectedFile &&
              selectedFile.map((file, idx) => (
                <div
                  key={idx}
                  className="relative flex justify-center items-center overflow-hidden rounded-lg my-1 w-full sm:w-[40%] md:w-[60%] lg:w-[80%] mx-auto"
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
              <p className="my-2 text-center self-center text-red-700">
                {error}
              </p>
            )}

            <button
              disabled={creatingList || isUploading}
              className="p-3 bg-[#b09e99] text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 disabled:cursor-not-allowed text-xl font-semibold border border-black/50"
            >
              {creatingList ? "creating..." : "Create Listing"}
            </button>
            {createListError && (
              <p className="text-sm text-red-700 text-center">
                {createListError}
              </p>
            )}
          </div>
        </form>
      </main>
    </Container>
  );
};

export default CreateListing;
