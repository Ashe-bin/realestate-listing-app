import Container from "@/components/Container";
import { useEffect, useState } from "react";
import { TbFaceIdError } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";

const ShowImage = () => {
  const [listing, setListing] = useState(null);
  const { listingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/listing/getListing/${listingId}`);
        const data = await res.json();
        if (data.success == false) {
          setError(true);

          return;
        }
        setListing(data);
      } catch (error) {
        console.error(`${error.message}`);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);
  return (
    <>
      <Container>
        {error && (
          <div className="flex flex-col gap-4 items-center justify-center h-[50%] text-center px-4 py-10 ">
            <TbFaceIdError className="w-24 h-24 text-slate-700 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">
              Its Our bad, Could not fetch image
            </h2>
            <p className="text-muted-foreground text-lg">
              Go back to and try again
            </p>
            <button
              className="border border-black/60 capitalize bg-[#c0fdfb] py-1 px-4  rounded-md hover:bg-[#d8e2dc] active:bg-[#c0fdfb] text-lg font-semibold text-slate-700"
              onClick={() => {
                navigate(`/listing/${listing._id}`);
              }}
            >
              Back
            </button>{" "}
          </div>
        )}
        {loading && (
          <div className="grid items-center lg:grid-cols-2 min-h-[70vh]  gap-5 py-10 ">
            {Array.from({ length: 2 }, (_, index) => (
              <div
                key={index}
                className="border border-black/20 h-[24rem] rounded-2xl bg-slate-400 animate-pulse"
              ></div>
            ))}
          </div>
        )}
        {!loading && !error && (
          <div className="grid  items-center lg:grid-cols-2 min-h-[70vh]  gap-5 py-10 overflow-clip rounded-xl">
            {listing?.imageURLS?.map((url, index) => (
              <div key={index}>
                <img src={url} className="object-cover rounded-xl" />
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
};

export default ShowImage;
