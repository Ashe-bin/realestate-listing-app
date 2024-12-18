import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState(null);
  console.log("listing", listing);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();

        if (data.success === false) {
          console.log("error data returned false", data);
        }
        setLandlord(data);
      } catch (error) {
        console.log("error cathc", error.message);
      }
    };
    fetchUser();
  }, [listing]);

  console.log("user name", landlord);

  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>{" "}
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message for the landlord"
            className="w-full border p-3 rounded-lg mt-2"
          ></textarea>
          <Link
            to={`mailto: ${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            send message
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contact;
