import axios from "../utils/axiosConfig";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Sparkles, ArrowRight } from "lucide-react";

const topics = [
  "Web Development", "React", "Physics", "Productivity",
  "AI", "Machine Learning", "Space Science", "Astrophysics",
  "JavaScript", "Python", "Algebra", "Trigonometry",
  "Data Structures", "Cybersecurity", "UI/UX Design", "Chemistry",
];

export default function PersonalizationPage() {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [customInterest, setCustomInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();
  const { setUser, setTab } = useAuth();

  const toggleTopic = (topic) => {
    if (loading) return;
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleInputChange = (e) => {
    setCustomInterest(e.target.value);
    setShowHint(!!e.target.value);
  };

  const handleContinue = async () => {
    let finalInterests = [...selectedTopics];

    const validCustomInterest = customInterest
      .split(",")
      .map((item) => item.trim())
      .every((item) => item === "" || /^[a-zA-Z\s]+$/.test(item));

    if (customInterest && !validCustomInterest) {
      toast.error("Use only letters and commas to separate interests.");
      return;
    }

    if (customInterest.trim()) {
      const extras = customInterest.split(",").map((i) => i.trim()).filter(Boolean);
      finalInterests.push(...extras);
    }

    if (!customInterest && selectedTopics.length === 0) {
      toast.error("Please select or enter at least one interest.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/v1/ai/suggest", {
        message: finalInterests.toString(),
      }, { withCredentials: true });

      toast.success("Interests saved!");
      setUser((prev) => ({ ...prev, suggestedKeywords: response.data }));

      const res = await axios.get("/api/v1/users/me", { withCredentials: true });
      setUser(res.data);
      setTab(response.data[0]);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong, try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #7c3aed, transparent)" }} />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <Sparkles size={14} className="text-violet-400" />
            <span className="text-violet-300 text-sm font-medium">Powered by Gemini AI</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            What do you want to <span className="gradient-text">learn?</span>
          </h1>
          <p className="text-gray-400 text-base">
            Select your interests and we&apos;ll build a personalized feed just for you.
          </p>
        </div>

        {/* Topic chips */}
        <div className="glass rounded-2xl p-6 mb-6">
          <p className="text-gray-400 text-sm font-medium mb-4">Popular topics</p>
          <div className="flex flex-wrap gap-2.5">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={`chip ${selectedTopics.includes(topic) ? "chip-active" : ""}`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Custom input */}
        <div className="glass rounded-2xl p-6 mb-8">
          <label className="block text-gray-400 text-sm font-medium mb-3">
            Add your own interests
          </label>
          <input
            type="text"
            disabled={loading}
            value={customInterest}
            onChange={handleInputChange}
            placeholder="e.g., Robotics, Quantum Physics, Blockchain"
            className="input-dark w-full h-11 rounded-xl px-4 text-sm"
          />
          {showHint && (
            <p className="text-gray-600 text-xs mt-2">
              Separate multiple interests with commas.
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={loading}
            className="btn-gradient h-12 px-8 rounded-xl text-white font-semibold flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Personalizing your feed...
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {selectedTopics.length > 0 && (
          <p className="text-center text-gray-600 text-sm mt-4">
            {selectedTopics.length} topic{selectedTopics.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>
    </div>
  );
}
