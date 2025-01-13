import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import placeholder from "../assests/placeholder.webp";

const LazyLoads = ({ src, alt, className = "" }) => {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      placeholderSrc={placeholder}
      className={`object-cover w-full h-full ${className}`}
      wrapperClassName="w-full h-full"
    />
  );
};

export default LazyLoads;
