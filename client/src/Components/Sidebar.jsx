import { Home, Snowflake, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const navigate = useNavigate();
  return (
    <div
      className="h-13 w-full bg-white fixed bottom-0 flex justify-between pl-4 pr-4 
    items-center border-t border-gray-200 sm:w-16 sm:h-full sm:flex-col sm:justify-normal sm:gap-10 sm:pt-22 sm:border-t-0 sm:border-r lg:pt-24 xl:pt-24"
    >
      <div
        className="flex justify-center flex-col items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <Home strokeWidth={1.5} />
        <p className="font-[calibri] text-[13px]">Home</p>
      </div>
      <div
        className="flex justify-center flex-col items-center cursor-pointer"
        onClick={() => navigate("/synthai")}
      >
        <Snowflake strokeWidth={1.5} />
        <p className="font-[calibri] text-[13px]">SynthAI</p>
      </div>
      <div
        className="flex justify-center flex-col items-center cursor-pointer"
        onClick={() => navigate("/update-profile")}
      >
        <User strokeWidth={1.5} />
        <p className="font-[calibri] text-[13px]">You</p>
      </div>
    </div>
  );
}
