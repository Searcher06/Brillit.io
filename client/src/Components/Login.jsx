import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/axiosConfig";
import { useAuth } from "../Context/AuthContext";
const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const disapledStyle = !password || !email ? "bg-pink-200" : null;
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // checking all the fields
    if (!email || !password) {
      toast.error("Please add all fields");
      return;
    }

    //  Simple email regex validator
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await axios.post("/api/v1/users/sign-in", {
        password,
        email,
      });
      console.log("Sign up successfully:", response.data);

      // saving the user info
      setUser(response.data);

      // navigating to home
      toast.success("Logged in successfully");
      setEmail("");
      setPassword("");
      navigate("/personalization");
    } catch (error) {
      if (error.response) {
        // server responded with a non-2xx status
        toast.error(error.response.data.message || "Sign up failed");
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        // something else happended
        toast.error("An error occured.");
      }
      console.error(error);
    }
  };

  return (
    <div className="w-full h-lvh flex justify-center items-center">
      <form
        className="w-90 h-120  shadow-xl rounded-lg flex flex-col items-center text-center border border-gray-200"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="text-3xl text-blue-700 font-semibold mt-4">
          Brillit.io
        </h2>
        <p className=" text-xl mt-2 font-semibold w-80">
          Welcome back to Brillit
        </p>
        <button className="cursor-pointer mt-4 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center justify-center">
          <FcGoogle size={20} className="mr-3" />
          <span className="font-semibold text-[15px]">Sign In with Google</span>
        </button>
        <div className="flex mt-3 gap-2 items-center">
          <hr className="h-[1px] bg-gray-500 border-0 w-28" />
          <p className="text-[13px] text-gray-800">OR</p>
          <hr className="h-[1px] bg-gray-500 border-0 w-28" />
        </div>

        <div className="mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center">
          <Mail size={20} className="ml-4" />
          <input
            className="outline-0 pl-2 text-sm w-full"
            placeholder="Email"
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            disabled={loading ? true : false}
          />
        </div>
        <div className="mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center">
          <Lock size={20} className="ml-4" />
          <input
            type={`${show ? "text" : "password"}`}
            className="outline-0 pl-2 text-sm"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            disabled={loading ? true : false}
          />
          {show ? (
            <Eye
              size={20}
              className="ml-5"
              onClick={() => {
                setShow((prevState) => !prevState);
              }}
            />
          ) : (
            <EyeOff
              size={20}
              className="ml-5"
              onClick={() => {
                setShow((prevState) => !prevState);
              }}
            />
          )}
        </div>
        <button
          className={`cursor-pointer h-11 w-65 bg-blue-700 rounded-[8px] mt-5 text-white text-[15px] ${disapledStyle}`}
          onClick={handleSubmit}
          disabled={!password || !email || loading ? true : false}
        >
          {loading ? "Signing in" : "Login"}
        </button>
        <p className="text-[14px] mt-5">
          {`Don't have an account`} ?{" "}
          <Link to={"/signup"} className="text-blue-700">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
