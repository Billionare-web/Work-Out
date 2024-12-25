import { Skeleton } from "@/components/ui/skeleton";
import { AiOutlineLoading } from "react-icons/ai";
const FillMode = () => {
  return (
    <Skeleton className="h-Full w-Full rounded-xl inset-0 absolute flex justify-center items-center ">
      <AiOutlineLoading className="w-[32px] h-[32px] animate-spin" />
    </Skeleton>
  );
};

export default FillMode;
