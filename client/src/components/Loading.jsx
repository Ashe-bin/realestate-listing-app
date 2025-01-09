import { motion } from "framer-motion";
import "./TypingSplash.css"; // Make sure to include the CSS file

const Loading = () => {
  return (
    <motion.div
      className="splash-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="typing">Welcome to Real-Listing</div>
    </motion.div>
  );
};

export default Loading;
