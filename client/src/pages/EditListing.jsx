import { useEffect, useState } from "react";
import useImagePreview from "../hooks/useImagePreview";
import { AiOutlineClose } from "react-icons/ai";
import { supabase } from "../supabase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@/components/Container";

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
    propertyType: "",
    houseArea: 0,
    lotArea: 0,
    developedDate: "",
    propertyDetail: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/listing/getListing/${listingId}`);
        const data = await res.json();

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
    console.log("exec");

    setCreateListError(true);
    setCreateListError(null);
    console.log(formData);

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
      console.log("data", data);

      if (data.success === false) {
        setCreateListError("Create list failed, try again");
        return;
      }
      setFormData(data);
      setInitialExtracted(data.imageURLS);
      setSelectedFile(null);
      setImageFile([]);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setCreateListError("Create list failed, try again");
      console.error(error.message);
    } finally {
      setCreatingList(false);
    }
  };

  return (
    <Container>
      <main className="my-7 flex flex-col gap-5 ">
        <div className="flex ">
          <h1 className="inline-block text-xl   sm:font-semibold md:text-2xl lg:text-4xl  rounded-2xl py-2 px-4 shadow-inner  shadow-[#155e75]/20  text-[#155e75] uppercase mx-auto ">
            Update Listing
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-10 mx-auto flex-shrink-0"
        >
          <div className="flex flex-col gap-4 flex-1 border border-black/10 rounded-lg shadow-md shadow-gray-300 text-slate-700 font-semibold p-2 w-full md:w-[70%] mx-auto lg:basis-1/2 md:p-5">
            <input
              type="text"
              placeholder="Name of developer company/(Name of a person if individual)"
              className="border rounded-lg font-normal p-2 placeholder:text-sm md:placeholder:text-md md:p-3 focus:outline-none focus:border-black focus:ring focus:ring-black/20"
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
              className="border p-2 rounded-lg font-normal placeholder:text-sm md:placeholder:text-md md:p-3 focus:outline-none focus:border-black focus:ring focus:ring-black/20"
              id="propertyType"
              onChange={handleFormChange}
              value={formData.propertyType}
              required
            />
            <textarea
              type="text"
              placeholder="Short description"
              className="border p-2 rounded-lg font-normal placeholder:text-sm md:placeholder:text-md md:p-3 focus:outline-none focus:border-black focus:ring focus:ring-black/20"
              id="description"
              onChange={handleFormChange}
              value={formData.description}
              required
              rows={4}
            />
            <textarea
              type="text"
              placeholder="property detail(modern kitchen with granite counter tops, a private backyard with a deck...)"
              className="border p-2 rounded-lg placeholder:text-sm md:placeholder:text-md md:p-3 font-normal focus:outline-none focus:border-black focus:ring focus:ring-black/20"
              id="propertyDetail"
              onChange={handleFormChange}
              value={formData.propertyDetail}
              required
              rows={4}
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-2 rounded-lg placeholder:text-sm md:placeholder:text-md md:p-3 focus:outline-none font-normal focus:border-black focus:ring focus:ring-black/20"
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
                className="border p-2 rounded-lg focus:outline-none placeholder:text-sm md:placeholder:text-md md:p-3 focus:border-black focus:ring focus:ring-black/20"
                id="developedDate"
                onChange={handleFormChange}
                value={formData.developedDate}
                required
              />{" "}
            </div>
            <div className="flex gap-6 flex-wrap flex-col sm:flex-row">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  onChange={handleFormChange}
                  checked={formData.type === "sale"}
                  id="sale"
                  name="type"
                  className="w-6 h-6 rounded-md focus:outline-none border focus:border-black focus:ring focus:ring-black/20 checked:bg-black/60 checked:border-black/30"
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
                  className="w-6 h-6 rounded-md focus:outline-none border  focus:border-black focus:ring focus:ring-black/20 checked:bg-black/60 checked:border-black/30"
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
            <div className="flex flex-wrap flex-col sm:flex-row gap-4">
              <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2">
                <input
                  type="number"
                  id="bedRoom"
                  onChange={handleFormChange}
                  value={formData.bedRoom}
                  min="0"
                  max="100"
                  required
                  className="p-3 border  border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20"
                />
                <p>Beds</p>
              </div>
              <div className="flex flex-col items-start sm:items-center gap-2 sm:flex-row">
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
              <div className="flex flex-col sm:flex-row sm:items-center items-start gap-2 ">
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
              <div className="flex flex-col sm:flex-row items-start  sm:items-center gap-2">
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
          <div className="flex flex-col flex-1 gap-4 w-full md:w-[70%] mx-auto border border-black/10 p-5 lg:basis-1/2 rounded-lg">
            <p className="font-semibold text-slate-700 text-lg  ">
              Images:{" "}
              <span className="font-normal text-gray-600 ml-2">
                The first image will be the cover of you listing (max-6)
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring focus:ring-black/20 file:border-black/50 file:text-slate-700 file:rounded-lg w-full"
                type="file"
                id="images"
                accept="image/*"
                onChange={handleFileChange}
                multiple
              />
              <button
                type="button"
                disabled={error || imageFile.length === 0}
                className="p-3 disabled:text-gray-700 disabled:cursor-not-allowed  text-slate-700 border border-black/30 bg-[#64b6ac]  rounded-xl font-semibold uppercase hover:shadow-lg disabled:opacity-80"
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
            {initialExtracted &&
              initialExtracted.map((img, idx) => (
                <div
                  key={idx}
                  className="relative flex justify-center items-center overflow-hidden rounded-lg my-1 w-full sm:w-[40%] md:w-[60%] lg:w-[80%] mx-auto border-2 border-black/20  "
                >
                  <img
                    src={img}
                    alt="listing-image"
                    className="object-cover overflow-clip w-full h-80 self-center transition-all duration-1000 ease-in-out hover:scale-105"
                  />
                  <AiOutlineClose
                    onClick={() => handleDeleteImgFetched(img)}
                    className="bg-white text-black rounded-full p-1 size-6 font-bold absolute top-1 right-1 hover:text-white  hover:bg-red-400 transition-all ease-in-out border border-black/30 hover:scale-125 duration-1000 "
                  />
                </div>
              ))}
            {selectedFile &&
              selectedFile.map((file, idx) => (
                <div
                  key={idx}
                  className="relative flex justify-center items-center overflow-hidden rounded-lg my-1 w-full sm:w-[40%] md:w-[60%] lg:w-[80%] mx-auto border-2 border-black/20"
                >
                  <img
                    src={file}
                    alt="listing-image"
                    className="object-cover overflow-clip w-full h-80 self-center  transition-transform duration-700 ease-in-out hover:scale-105"
                  />
                  <AiOutlineClose
                    onClick={() => handleDeleteImg(idx)}
                    className="bg-white text-black rounded-full p-1 size-6 font-bold absolute top-1 right-1 hover:text-white  hover:bg-red-700 transition-all duration-1000 hover:scale-125 border border-black/30 ease-in-out"
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
    </Container>
  );
};

export default EditListing;
