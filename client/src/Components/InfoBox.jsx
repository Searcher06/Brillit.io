import { useState } from "react";

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

    const toggleTopic = (topic) => {
        setSelectedTopics((prev) =>
            prev.includes(topic)
                ? prev.filter((t) => t !== topic)
                : [...prev, topic]
        );
    };

    const handleContinue = () => {
        const finalInterests = [...selectedTopics];
        if (customInterest.trim()) {
            finalInterests.push(customInterest.trim());
        }

        console.log("User interests:", finalInterests);
        // Submit to backend or route to dashboard
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
                            onClick={() => toggleTopic(topic)}
                            className={`cursor-pointer border p-3 rounded-xl text-sm font-medium text-center transition ${selectedTopics.includes(topic)
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {topic}
                        </div>
                    ))}
                </div>

                <input
                    type="text"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    placeholder="What else do you want to learn?"
                    className="w-full border border-gray-300 rounded-xl p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="text-center">
                    <button
                        onClick={handleContinue}
                        className="bg-blue-600 text-white px-6 py-2 rounded-xl text-lg hover:bg-blue-700 transition"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
