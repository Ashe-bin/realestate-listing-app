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
          background: "#34d399",
          color: "#fff",
        },
      }}
    />
  );
};

export default ToastContainer;
