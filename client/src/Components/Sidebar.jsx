import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { faSnowflake } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "../Context/authContext";
export function Sidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // console.log("The current user state : ", user)
  return (
    <section id="sidebar" className="">
      <div
        className="text-center cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        <FontAwesomeIcon icon={faHome} className=" text-xl md:mt-8" />
        <p className="font-[calibri] text-sm">Home</p>
      </div>
      <div
        className="text-center cursor-pointer"
        onClick={() => {
          navigate("/synthai");
        }}
      >
        <FontAwesomeIcon
          icon={faSnowflake}
          className="text-gray-700 text-xl md:mt-4"
        />
        <p className="font-[calibri] text-sm">SynthAi</p>
      </div>
      <div
        className="text-center cursor-pointer"
        onClick={() => navigate("/update-profile")}
      >
        <img
          src={`${user?.profilePic ? user?.profilePic : null}`}
          className="w-10 h-10 rounded-full flex justify-center items-center md:mt-4"
        />
        <p className="font-[calibri] text-sm">{`${user.firstName}`}</p>
      </div>
    </section>
  );
}
