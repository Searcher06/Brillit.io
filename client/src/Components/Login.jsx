import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/axiosConfig";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setTab } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) { toast.error("Please enter a valid email address"); return; }

    try {
      setLoading(true);
      const response = await axios.post("/api/v1/users/sign-in", { password, email });
      setUser(response.data);
      setTab(response.data.suggestedKeywords[0]);
      toast.success("Welcome back!");
      setEmail(""); setPassword("");
      navigate("/personalization");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && email && password && !loading) handleSubmit();
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0a0a0f" }}>
      {/* Left branding panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #0a0a0f 60%, #1a0533 100%)" }}>
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute bottom-32 right-10 w-56 h-56 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #4f46e5, transparent)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles size={22} className="text-violet-400" />
            <span className="text-xl font-bold gradient-text">Brillit.io</span>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Learn smarter,<br />
            <span className="gradient-text">not harder.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            AI-powered educational videos personalized to your learning path. Discover, watch, and grow.
          </p>
          <div className="mt-8 flex gap-6">
            {["AI Recommendations", "Fast Search", "Personalized Feed"].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span className="text-gray-400 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-gray-600 text-sm">© 2025 Brillit.io</p>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Sparkles size={20} className="text-violet-400" />
            <span className="text-xl font-bold gradient-text">Brillit.io</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to continue learning</p>

          {/* Google button */}
          <button
            type="button"
            className="w-full h-11 glass rounded-xl flex items-center justify-center gap-3 text-gray-300 text-sm font-medium hover:border-violet-500/40 transition-all mb-6"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <hr className="flex-1 border-gray-800" />
            <span className="text-gray-600 text-xs">OR</span>
            <hr className="flex-1 border-gray-800" />
          </div>

          {/* Email */}
          <div className="relative mb-4">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              className="input-dark w-full h-11 rounded-xl pl-10 pr-4 text-sm"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type={show ? "text" : "password"}
              className="input-dark w-full h-11 rounded-xl pl-10 pr-10 text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              onClick={() => setShow((p) => !p)}
            >
              {show ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          {/* Submit */}
          <button
            className="btn-gradient w-full h-11 rounded-xl text-white text-sm font-semibold"
            onClick={handleSubmit}
            disabled={!email || !password || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : "Sign In"}
          </button>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/signUp" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
