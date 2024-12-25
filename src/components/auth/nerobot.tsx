import { Input } from "../ui/input";

const Nerobot = () => {
  return (
    <div className="flex items-center gap-4 my-3">
      <Input type="checkbox" className="w-[24px] h-[24px]" />
      <span className="text-[18px]">I am not robot</span>
    </div>
  );
};

export default Nerobot;
