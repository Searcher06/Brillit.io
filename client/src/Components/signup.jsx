import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isDisabled =
    !data.firstName || !data.lastName || !data.password ||
    !data.email || data.password.length < 6 || loading;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!data.firstName || !data.lastName || !data.email || !data.password) {
      toast.error("Please fill in all fields"); return;
    }
    if (data.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (data.firstName.length < 3) { toast.error("First name must be at least 3 characters"); return; }
    if (data.lastName.length < 3) { toast.error("Last name must be at least 3 characters"); return; }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) { toast.error("Please enter a valid email address"); return; }

    try {
      setLoading(true);
      await axios.post("/api/v1/users/sign-up", { ...data });
      toast.success("Account created! Please sign in.");
      navigate("/login");
      setData({ firstName: "", lastName: "", email: "", password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign up failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const field = (icon, placeholder, key, type = "text") => (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>
      <input
        className="input-dark w-full h-11 rounded-xl pl-10 pr-4 text-sm"
        placeholder={placeholder}
        type={type}
        value={data[key]}
        onChange={(e) => setData((p) => ({ ...p, [key]: e.target.value }))}
        disabled={loading}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0a0a0f" }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #0a0a0f 60%, #1a0533 100%)" }}>
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute bottom-32 right-10 w-56 h-56 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #4f46e5, transparent)" }} />

        <div className="relative z-10 flex items-center gap-2">
          <Sparkles size={22} className="text-violet-400" />
          <span className="text-xl font-bold gradient-text">Brillit.io</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Start your<br />
            <span className="gradient-text">learning journey.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Join thousands of students discovering personalized educational content every day.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { label: "AI-Powered", desc: "Smart recommendations" },
              { label: "Fast Search", desc: "Typo-tolerant results" },
              { label: "Personalized", desc: "Tailored to you" },
              { label: "Free", desc: "Always free to use" },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl p-3">
                <p className="text-white text-sm font-semibold">{item.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-gray-600 text-sm">© 2025 Brillit.io</p>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Sparkles size={20} className="text-violet-400" />
            <span className="text-xl font-bold gradient-text">Brillit.io</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-1">Create account</h2>
          <p className="text-gray-500 mb-8">Join Brillit and level up your learning</p>

          <button type="button"
            className="w-full h-11 glass rounded-xl flex items-center justify-center gap-3 text-gray-300 text-sm font-medium hover:border-violet-500/40 transition-all mb-6">
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <hr className="flex-1 border-gray-800" />
            <span className="text-gray-600 text-xs">OR</span>
            <hr className="flex-1 border-gray-800" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {field(<User size={16} />, "First name", "firstName")}
              {field(<User size={16} />, "Last name", "lastName")}
            </div>
            {field(<Mail size={16} />, "Email address", "email", "email")}

            {/* Password with toggle */}
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={show ? "text" : "password"}
                className="input-dark w-full h-11 rounded-xl pl-10 pr-10 text-sm"
                placeholder="Password (min. 6 characters)"
                value={data.password}
                onChange={(e) => setData((p) => ({ ...p, password: e.target.value }))}
                disabled={loading}
              />
              <button type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                onClick={() => setShow((p) => !p)}>
                {show ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            <button
              type="submit"
              className="btn-gradient w-full h-11 rounded-xl text-white text-sm font-semibold mt-2"
              disabled={isDisabled}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
