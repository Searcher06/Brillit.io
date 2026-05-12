import { toast } from "sonner";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
      <span
        className="absolute left-3.5 top-1/2 -translate-y-1/2"
        style={{ color: "var(--text-faint)" }}
      >
        {icon}
      </span>
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
    <div className="min-h-screen w-full overflow-x-hidden flex" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Left branding panel */}
      <div className="auth-brand-panel hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute bottom-32 right-10 w-56 h-56 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #4f46e5, transparent)" }} />

        <div className="relative z-10 flex items-center">
          <span className="text-xl font-bold gradient-text">Brillit.io</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: "var(--text-primary)" }}>
            Start your<br />
            <span className="gradient-text">learning journey.</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
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
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm" style={{ color: "var(--text-faint)" }}>© 2025 Brillit.io</p>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 overflow-x-hidden">
        <div className="w-full max-w-md auth-form-card">
          <div className="flex items-center mb-8 lg:hidden">
            <span className="text-xl font-bold gradient-text">Brillit.io</span>
          </div>

          <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Create account</h2>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>Join Brillit and level up your learning</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            <div className="grid grid-cols-2 gap-3">
              {field(<User size={16} />, "First name", "firstName")}
              {field(<User size={16} />, "Last name", "lastName")}
            </div>
            {field(<Mail size={16} />, "Email address", "email", "email")}

            {/* Password with toggle */}
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
              <input
                type={show ? "text" : "password"}
                className="input-dark w-full h-11 rounded-xl pl-10 pr-10 text-sm"
                placeholder="Password (min. 6 characters)"
                value={data.password}
                onChange={(e) => setData((p) => ({ ...p, password: e.target.value }))}
                disabled={loading}
              />
              <button type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "var(--text-faint)" }}
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

          <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
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
