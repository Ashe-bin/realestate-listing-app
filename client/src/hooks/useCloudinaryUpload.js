import { useRef, useState, useEffect } from "react";

const useCloudinaryUpload = (multiple = false) => {
  const [uploadedImgURL, setUploadedImgURL] = useState([]);
  const [imgUploading, setImgUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dwxerup0m",
        uploadPreset: "real-listing-image",
        multiple: multiple,
      },
      (error, result) => {
        if (uploadError) {
          setImgUploading(false);
          setUploadError(error);
          console.log("error", error);
        } else if (result.event === "success") {
          setImgUploading(false);
          const publicURL = result.info.secure_url;
          console.log("publicURL", publicURL);
          if (multiple) {
            setUploadedImgURL((prev) => [...prev, publicURL]);
          } else {
            setUploadedImgURL([publicURL]);
          }
        }
      }
    );
  }, [multiple]);

  const cloudinaryImgUpload = () => {
    setImgUploading(true);
    console.log("started execution");
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return {
    cloudinaryImgUpload,
    uploadedImgURL,
    setUploadedImgURL,
    uploadError,
    imgUploading,
  };
};

export default useCloudinaryUpload;
