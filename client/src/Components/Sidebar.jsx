import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { faCircleUser, faSnowflake } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "../Context/authContext";
export function Sidebar() {
    const navigate = useNavigate()
    const { user } = useAuth()
    return <section id="sidebar" className="w-18 h-lvh fixed z-1 flex flex-col items-center mt-12">
        <div className="text-center cursor-pointer" onClick={() => {
            navigate('/')
        }}>
            <FontAwesomeIcon icon={faHome} className=" text-xl mt-8" />
            <p className="font-[calibri] text-sm">Home</p>
        </div>
        <div className="text-center cursor-pointer" onClick={() => {
            navigate('/synthai')
        }}>
            <FontAwesomeIcon icon={faSnowflake} className="text-gray-700 text-xl mt-4" />
            <p className="font-[calibri] text-sm">SynthAi</p>
        </div>
        <div className="text-center cursor-pointer" onClick={() => navigate('/update-profile')}>
            <img src={`${user.profilePic}`} className="w-10 h-10 rounded-full flex justify-center items-center mt-4" />
            <p className="font-[calibri] text-sm">{`${user.firstName}`}</p>
        </div>
    </section>;
}
