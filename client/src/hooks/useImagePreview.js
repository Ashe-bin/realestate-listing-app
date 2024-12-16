import { useState } from "react";

const useImagePreview = () => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [error, setError] = useState(null);

  const handleImageChange = (files) => {
    files.forEach((file) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          // filePreviews.push(reader.result);
          setSelectedFile((prevFiles) => [...prevFiles, reader.result]);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Only Image files are accepted");
      }
    });
  };
  return { selectedFile, handleImageChange, error, setSelectedFile };
};

export default useImagePreview;
