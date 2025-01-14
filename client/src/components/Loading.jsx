import { motion } from "framer-motion";

const Loading = () => {
  const gradientVariants = {
    animate: {
      backgroundImage: [
        "linear-gradient(90deg, #ff7eb3, #ff758c, #ff7eb3)",
        "linear-gradient(90deg, #8e44ad, #3498db, #2ecc71)",
        "linear-gradient(90deg, #ff7eb3, #ff758c, #ff7eb3)",
      ],
      transition: {
        duration: 6, // Duration of the full animation cycle
        repeat: Infinity, // Infinite loop
        repeatType: "loop",
      },
    },
  };

  return (
    <motion.div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e7e5e4", // Set background color
        backgroundImage:
          "linear-gradient(to right, #3c6b6407 1px, transparent 1px), linear-gradient(to bottom, #4da6ae0a 1px, transparent 1px)", // Custom grid pattern
        backgroundSize: "20px 20px", // Grid size
        fontFamily: "'Roboto', sans-serif", // Font family
        overflowX: "hidden", // To prevent horizontal overflow
      }}
      className="font-sans"
    >
      <motion.div
        style={{
          fontSize: "3rem", // Larger text size
          fontWeight: "bold",
          textAlign: "center",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
        variants={gradientVariants}
        animate="animate"
      >
        Welcome to Real-Listing
      </motion.div>
    </motion.div>
  );
};

export default Loading;
