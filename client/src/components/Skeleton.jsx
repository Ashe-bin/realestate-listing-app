import Container from "./Container";

export const HomePageSkeleton = () => {
  const items = Array(3).fill(null);
  return (
    <Container>
      <div className="flex flex-col">
        <div className="w-full   items-center  flex flex-col gap-10   py-10 ">
          <div className="flex flex-col  w-[40%]  gap-2">
            <div className="h-3 rounded w-[50%]    bg-slate-400 animate-pulse"></div>
            <div className="h-4 rounded w-[80%] bg-slate-400 animate-pulse"></div>
          </div>
          <div className="grid  md:grid-cols-2 xl:grid-cols-3    gap-5  ">
            {items.map((_, idx) => (
              <ListingItemSkeleton key={idx} />
            ))}
          </div>
        </div>
        <div className="w-full text-center  items-center  flex flex-col gap-10   py-10 ">
          <div className="flex flex-col  w-[40%]  gap-2">
            <div className="h-3 rounded w-[50%]    bg-slate-400 animate-pulse"></div>
            <div className="h-4 rounded w-[80%] bg-slate-400 animate-pulse"></div>
          </div>{" "}
          <div className="grid  md:grid-cols-2 xl:grid-cols-3    gap-5  ">
            {items.map((_, idx) => (
              <ListingItemSkeleton key={idx} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export const ListingPageSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-[50vh]  w-[80%] bg-black/20 rounded-2xl animate-pulse"></div>
      <div className="h-10 w-[30%] bg-slate-400 animate-pulse rounded-2xl"></div>
      <div className="h-10 w-[60%] bg-slate-400 animate-pulse rounded-2xl"></div>
    </div>
  );
};

export const ListingItemSkeleton = () => {
  return (
    <div className=" bg-white/5 overflow-clip  shadow-md shadow-gray-[#c0fdfb] hover:shadow-lg   rounded-xl w-[95%] mx-auto sm:w-[330px] border border-black/20  ">
      <div className="relative overflow-clip h-[320px] sm:h-[220px] w-full bg-slate-300 animate-pulse"></div>
      <div className="p-3 flex flex-col gap-5 w-full h-40 justify-center">
        <div className="flex items-center w-[30%] gap-1 h-3 rounded-2xl bg-slate-300 animate-pulse"></div>
        <div className="flex items-center w-[60%] gap-1 h-4 rounded-xl bg-slate-400 animate-pulse"></div>
        <div className="flex items-center gap-1 h-4 rounded-lg bg-slate-500 animate-pulse"></div>
      </div>
    </div>
  );
};
