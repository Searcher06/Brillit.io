import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
    <div className="min-h-screen w-full overflow-x-hidden flex" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Left branding panel — hidden on mobile */}
      <div className="auth-brand-panel hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute bottom-32 right-10 w-56 h-56 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #4f46e5, transparent)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text">Brillit.io</span>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: "var(--text-primary)" }}>
            Learn smarter,<br />
            <span className="gradient-text">not harder.</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
            AI-powered educational videos personalized to your learning path. Discover, watch, and grow.
          </p>
          <div className="mt-8 flex gap-6">
            {["AI Recommendations", "Fast Search", "Personalized Feed"].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm" style={{ color: "var(--text-faint)" }}>© 2025 Brillit.io</p>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 overflow-x-hidden">
        <div className="w-full max-w-md auth-form-card">
          {/* Mobile logo */}
          <div className="flex items-center mb-8 lg:hidden">
            <span className="text-xl font-bold gradient-text">Brillit.io</span>
          </div>

          <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Welcome back</h2>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>Sign in to continue learning</p>

          {/* Email */}
          <div className="relative mb-4 mt-6">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
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
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
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
              className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "var(--text-faint)" }}
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

          <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
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
