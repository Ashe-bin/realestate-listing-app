import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Container from "@/components/Container";
import ListingForm from "@/components/ListingForm";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [creatingList, setCreatingList] = useState(false);
  const [createListError, setCreateListError] = useState(null);
  const [imgURLS, setImgURLS] = useState([]);

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
      <main className=" my-7 flex flex-col gap-5">
        <div className="flex ">
          <h1 className="inline-block text-xl   sm:font-semibold md:text-2xl lg:text-4xl   rounded-2xl  py-2 px-4 shadow-inner  shadow-[#155e75]/20  text-[#155e75] uppercase mx-auto ">
            Create Listing
          </h1>
        </div>
        <ListingForm
          handleSubmit={handleSubmit}
          handleFormChange={handleFormChange}
          formData={formData}
          setFormData={setFormData}
          setImgURLS={setImgURLS}
          imgURLS={imgURLS}
        />
      </main>
    </Container>
  );
};

export default CreateListing;
