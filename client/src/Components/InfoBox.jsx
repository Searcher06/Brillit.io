import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";
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
  const { setUser, user } = useAuth();
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
        suggestedKeywords: response.data.keywords,
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
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Personalize Your Experience
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Select your interests so we can tailor content just for you.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {topics.map((topic, idx) => (
            <div
              key={idx}
              onClick={loading ? null : () => toggleTopic(topic)}
              className={`cursor-pointer border p-3 rounded-xl text-sm font-medium text-center transition ${
                selectedTopics.includes(topic)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {topic}
            </div>
          ))}
        </div>

        {/* Custom text input for extra interests */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add your own interests
          </label>
          <input
            type="text"
            disabled={loading ? true : false}
            value={customInterest}
            onChange={handleInputChange}
            placeholder="e.g., Cybersecurity, UI/UX, Robotics"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showHint && (
            <p className="text-xs text-gray-500 mt-1">
              {"If you're adding more than one, separate them with commas. ','"}
            </p>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={loading ? true : false}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl text-lg hover:bg-blue-600 transition"
          >
            {loading ? "Personalizing..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
