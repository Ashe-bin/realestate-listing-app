const Container = ({ children, className }) => {
  return (
    <div className={`w-[95%] md:w-[90%]   mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default Container;
