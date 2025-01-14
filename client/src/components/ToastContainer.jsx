import { Toaster } from "react-hot-toast";
const ToastContainer = () => {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 3000,
        removeDelay: 1000,
        style: {
          background: "#a1a1aa",
          color: "#fff",
        },
      }}
    />
  );
};

export default ToastContainer;
