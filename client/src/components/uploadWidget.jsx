import { useEffect, useRef } from "react";

const UploadWidget = ({ onComplete, button, className, disabled }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dwxerup0m",
        uploadPreset: "real-listing-image",
      },
      function (error, result) {
        if (result.event === "success") {
          const publicURL = result.info.secure_url;
          onComplete(null, { publicURL, result });
        } else if (error) {
          onComplete(error, null);
        }
      }
    );
  }, [onComplete]);

  return (
    <button
      disabled={disabled}
      className={`${className}`}
      onClick={() => widgetRef.current.open()}
    >
      {button}
    </button>
  );
};

export default UploadWidget;
