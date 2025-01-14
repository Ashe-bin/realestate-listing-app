import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@/components/Container";
import ListingForm from "@/components/ListingForm";
import toast from "react-hot-toast";

const EditListing = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [isCreatingList, setIsCreatingList] = useState(false);
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
          console.error(`fetching list error ${data}`);
          toast.error("Could not fetch listing for edit");
          navigate("/");
          return;
        }
        setFormData(data);
      } catch (error) {
        console.error(`fetching list  error ${error.message}`);
        navigate("/");
      }
    };
    fetchData();
  }, [listingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsCreatingList(true);

    if (formData.imageURLS.length === 0) {
      toast.error("you need to have uploaded image, please upload images");
      setIsCreatingList(false);
      return;
    }

    try {
      const res = await fetch(`/api/listing/edit/${listingId}`, {
        method: "POST",
        headers: { "Content-Type": "Application/JSON" },
        body: JSON.stringify({ ...formData, userRef: currentUser?._id }),
      });

      const data = await res.json();

      if (data.success === false) {
        console.error(`error to post edited list ${data}`);
        console.log("data", data);
        toast.error("Failed to updata listing, please try again");
        return;
      }
      setFormData(data);
      toast.success("Successfully edited your listing");
      console.log("data", data);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      console.error(`updating listing error ${error.message}`);
    } finally {
      setIsCreatingList(false);
    }
  };

  return (
    <Container>
      <main className="my-7 flex flex-col gap-5 ">
        <div className="flex ">
          <h1 className="inline-block text-xl   sm:font-semibold md:text-2xl lg:text-4xl  rounded-xl py-2 px-4 shadow-inner  shadow-[#334155]/50  text-[#334155] capitalize mx-auto ">
            Update Listing
          </h1>
        </div>
        <ListingForm
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          isCreatingList={isCreatingList}
          button={"Update Listing"}
        />
      </main>
    </Container>
  );
};

export default EditListing;
