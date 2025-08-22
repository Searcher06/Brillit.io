// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHome } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";
// import { faSnowflake } from "@fortawesome/free-regular-svg-icons";
// import { useAuth } from "../Context/AuthContext";
// export function Sidebar() {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   // console.log("The current user state : ", user)
//   return (
//     <section id="sidebar" className="">
//       <div
//         className="text-center cursor-pointer"
//         onClick={() => {
//           navigate("/");
//         }}
//       >
//         <FontAwesomeIcon icon={faHome} className=" text-xl md:mt-8" />
//         <p className="font-[calibri] text-sm">Home</p>
//       </div>
//       <div
//         className="text-center cursor-pointer"
//         onClick={() => {
//           navigate("/synthai");
//         }}
//       >
//         <FontAwesomeIcon
//           icon={faSnowflake}
//           className="text-gray-700 text-xl md:mt-4"
//         />
//         <p className="font-[calibri] text-sm">SynthAi</p>
//       </div>
//       <div
//         className="text-center cursor-pointer"
//         onClick={() => navigate("/update-profile")}
//       >
//         <img
//           src={`${user?.profilePic ? user?.profilePic : null}`}
//           className="w-10 h-10 rounded-full flex justify-center items-center md:mt-4"
//         />
//         <p className="font-[calibri] text-sm">{`${user.firstName}`}</p>
//       </div>
//     </section>
//   );
// }

import { Home, Snowflake, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
export function Sidebar() {
  const navigate = useNavigate();
  return (
    <div
      className="h-13  w-full bg-white fixed bottom-0 flex justify-between pl-4 pr-4 
    items-center sm:w-16 sm:h-full sm:flex-col sm:justify-normal sm:gap-10 sm:pt-22 lg:pt-24 xl:pt-24"
    >
      <div
        className="flex justify-center flex-col items-center"
        onClick={() => {
          navigate("/");
        }}
      >
        <Home strokeWidth={1.5} />
        <p className="font-[calibri] text-[13px]">Home</p>
      </div>
      <div
        className="flex justify-center flex-col items-center"
        onClick={() => {
          navigate("/synthai");
        }}
      >
        <Snowflake strokeWidth={1.5} />
        <p className="font-[calibri] text-[13px]">SynthAI</p>
      </div>
      <div
        className="flex justify-center flex-col items-center"
        onClick={() => {
          navigate("/update-profile");
        }}
      >
        <User strokeWidth={1.5} />
        <p className="font-[calibri] text-[13px]">You</p>
      </div>
    </div>
  );
}
