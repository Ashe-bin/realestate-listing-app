import { useState } from "react";

const useImagePreview = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const maxFileSize = 2 * 1024 * 1024;

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      if (file.size > maxFileSize) {
        setError("Image file size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Only Image files are accepted");
    }
  };
  return { selectedFile, setSelectedFile, handleImageChange, error };
};

export default useImagePreview;
