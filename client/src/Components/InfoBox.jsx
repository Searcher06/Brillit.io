import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
const topics = [
  "Web Development",
  "React",
  "Physics",
  "Productivity",
  "AI",
  "Machine Learning",
  "Space Science",
  "Astrophysics",
  "JavaScript",
  "Python",
  "Algebra",
  "Trigonometry",
];

export default function PersonalizationPage() {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [customInterest, setCustomInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleInputChange = (e) => {
    setCustomInterest(e.target.value);
    // setShowHint(e.target.value.includes(","));
    setShowHint(e.target.value);
  };

  const handleContinue = async () => {
    let finalInterests = [...selectedTopics];

    const validCustomInterest = customInterest
      .split(",")
      .map((item) => item.trim())
      .every((item) => item === "" || /^[a-zA-Z\s]+$/.test(item));
    if (customInterest && !validCustomInterest) {
      toast.error(
        "Please use only letters (A-Z, a-z) and commas to separate interests."
      );
      return;
    }

    if (customInterest.trim()) {
      const extras = customInterest
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
      finalInterests.push(...extras);
    }

    if (!customInterest && selectedTopics.length === 0) {
      toast.error("Interest should not be blank");
      return;
    }
    finalInterests = finalInterests.toString();
    console.log("User interests:", finalInterests);

    try {
      setLoading(true);
      const response = await axios.post("/api/v1/ai/suggest", {
        message: finalInterests,
      });
      toast.success("Interests saved successfully!");
      // Redirect to the next page or perform any other action
      setUser((prevState) => ({
        ...prevState,
        suggestedKeywords: response.data,
      }));

      // calling the api to get the latest user data after
      // successfully updating the user interests field
      const res = await axios.get("/api/v1/users/me", {
        withCredentials: true,
      });

      // updating the current user state
      setUser(res.data);
      navigate("/");
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        // server responded with a non-2xx status
        toast.error(error.response.data.error || "Failed try again");
        console.table(error);
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
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 lg:p-10 w-full max-w-md sm:max-w-lg lg:max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
          Personalize Your Experience
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
          Select your interests so we can tailor content just for you.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {topics.map((topic, idx) => (
            <div
              key={idx}
              onClick={loading ? null : () => toggleTopic(topic)}
              className={`cursor-pointer border p-2 sm:p-3 rounded-xl text-xs sm:text-sm font-medium text-center transition ${
                selectedTopics.includes(topic)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {topic}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Add your own interests
          </label>
          <input
            type="text"
            disabled={loading}
            value={customInterest}
            onChange={handleInputChange}
            placeholder="e.g., Cybersecurity, UI/UX, Robotics"
            className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          {showHint && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {"If you're adding more than one, separate them with commas."}
            </p>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={loading}
            className="bg-blue-600 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-lg hover:bg-blue-700 transition"
          >
            {loading ? "Personalizing..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
