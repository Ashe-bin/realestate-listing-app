import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Container from "@/components/Container";
import ListingForm from "@/components/ListingForm";
import toast from "react-hot-toast";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [isCreatingList, setIsCreatingList] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreatingList(true);
    if (formData.imageURLS.length === 0) {
      toast.error("Please upload images");
      setIsCreatingList(false);
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
        console.error(`creating list error ${data}`);
        toast.error("Creating list failed, please try again");
        return;
      }
      toast.success("Listing created successfully");
      console.log(data);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      console.error(`creating list error ${error.message}`);
      toast.error("Creating list failed, please try again");
    } finally {
      setIsCreatingList(false);
    }
  };
  return (
    <Container>
      <main className=" my-7 flex flex-col gap-5">
        <div className="flex ">
          <h1 className="inline-block text-xl   sm:font-semibold md:text-2xl lg:text-4xl   rounded-2xl  py-2 px-4 shadow-inner  shadow-[#ea580c]/50  text-[#854d0e] capitalize mx-auto ">
            Create Listing
          </h1>
        </div>
        <ListingForm
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          isCreatingList={isCreatingList}
          button={"Create Listing"}
        />
      </main>
    </Container>
  );
};

export default CreateListing;
