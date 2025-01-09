import { useEffect, useRef, useState } from "react";

const UploadWidget = ({
  onComplete,
  button,
  className,
  disabled,
  multiple = false,
}) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dwxerup0m",
        uploadPreset: "real-listing-image",
        multiple: true,
      },
      function (error, result) {
        console.log("result", result);
        if (result.event === "success") {
          const publicURL = result.info.secure_url;
          console.log(publicURL);

          if (multiple) {
            setUploadedImages((prev) => [...prev, publicURL]);
            console.log("uploadedImages", uploadedImages);
            onComplete(null, { publicURLs: uploadedImages, result });
          } else {
            onComplete(null, { publicURL, result });
          }
        } else if (error) {
          onComplete(error, null);
        }
      }
    );
  }, [onComplete, multiple, uploadedImages]);

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
