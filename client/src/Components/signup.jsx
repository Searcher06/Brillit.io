import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const disapledStyle =
    !data.firstName ||
    !data.lastName ||
    !data.password ||
    !data.email ||
    data.password.length < 6
      ? "bg-pink-200"
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // checking all the fields
    if (!data.firstName || !data.lastName || !data.email || !data.password) {
      toast.error("Please add all fields");
      return;
    }

    // checking the password length
    if (data.password.length < 6) {
      toast.error("Password must be greater than 5 characters");
      return;
    }

    // checking the firstname length
    if (data.firstName.length < 3) {
      toast.error("Firstname must be atleast 3 characters long");
      return;
    }

    // checking the lastname length
    if (data.lastName.length < 3) {
      toast.error("Lastname must be atleast 3 characters long");
      return;
    }

    //  Simple email regex validator
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("/api/v1/users/sign-up", {
        ...data,
      });

      toast.success("Account created successfully");
      console.log("Acount created successfully:", response.data);
      navigate("/login");
      setData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
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
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="min-h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8 bg-sky-50">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-md sm:max-w-lg lg:max-w-xl shadow-xl rounded-lg flex flex-col items-center text-center border border-gray-200 p-6 sm:p-8"
        >
          <h2 className="text-2xl sm:text-3xl text-blue-700 font-semibold mt-4">
            Brillit.io
          </h2>
          <p className="text-lg sm:text-xl mt-2 font-semibold w-full sm:w-80">
            Join Brillit and level up your study game
          </p>

          <button className="mt-3 h-11 w-full sm:w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center justify-center">
            <FcGoogle size={20} className="mr-3" />
            <span className="font-semibold text-[15px]">
              Sign Up with Google
            </span>
          </button>

          <div className="flex mt-3 gap-2 items-center w-full sm:w-auto">
            <hr className="h-[1px] bg-gray-500 border-0 flex-1" />
            <p className="text-[13px] text-gray-800">OR</p>
            <hr className="h-[1px] bg-gray-500 border-0 flex-1" />
          </div>

          <div className="mt-3 h-11 w-full sm:w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center">
            <User size={20} className="ml-4" />
            <input
              className="outline-0 pl-2 text-sm w-full"
              placeholder="Firstname"
              onChange={(event) =>
                setData({ ...data, firstName: event.target.value })
              }
              value={data.firstName}
              disabled={loading}
            />
          </div>

          <div className="mt-3 h-11 w-full sm:w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center">
            <User size={20} className="ml-4" />
            <input
              className="outline-0 pl-2 text-sm w-full"
              placeholder="Lastname"
              onChange={(event) =>
                setData({ ...data, lastName: event.target.value })
              }
              value={data.lastName}
              disabled={loading}
            />
          </div>

          <div className="mt-3 h-11 w-full sm:w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center">
            <Mail size={20} className="ml-4" />
            <input
              className="outline-0 pl-2 text-sm w-full"
              placeholder="Email"
              onChange={(event) =>
                setData({ ...data, email: event.target.value })
              }
              value={data.email}
              type="email"
              disabled={loading}
            />
          </div>

          <div className="mt-3 h-11 w-full sm:w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center">
            <Lock size={20} className="ml-4" />
            <input
              type={`${show ? "text" : "password"}`}
              className="outline-0 pl-2 text-sm w-full"
              placeholder="Password"
              onChange={(event) =>
                setData({ ...data, password: event.target.value })
              }
              value={data.password}
              disabled={loading}
            />
            {show ? (
              <Eye
                size={20}
                className="ml-5 cursor-pointer"
                onClick={() => setShow((prevState) => !prevState)}
              />
            ) : (
              <EyeOff
                size={20}
                className="ml-5 cursor-pointer"
                onClick={() => setShow((prevState) => !prevState)}
              />
            )}
          </div>

          <button
            className={`cursor-pointer h-11 w-full sm:w-65 bg-blue-700 rounded-[8px] mt-5 text-white text-[15px] ${disapledStyle}`}
            disabled={
              !data.firstName ||
              !data.lastName ||
              !data.password ||
              !data.email ||
              data.password.length < 6 ||
              loading
            }
            onClick={handleSubmit}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-[14px] mt-2">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-700">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignUp;
