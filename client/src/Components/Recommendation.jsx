/* eslint-disable react/prop-types */
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Recommendation({
  user,
  recommended,
  tab,
  setTab,
  setActive,
  setError,
}) {
  const chipRefs = useRef([]);
  const containerRef = useRef(null);

  const handleClick = (current, index) => {
    setTab(current);
    setActive("tab");
    setError(null);
    chipRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  const chips =
    user?.suggestedKeywords.length > 0 ? user.suggestedKeywords : recommended;

  return (
    <section
      id="recommendation"
      className="font-[calibri] flex items-center gap-2"
    >
      {/* Left button - only desktop */}
      <button
        onClick={scrollLeft}
        className="hidden md:flex bg-gray-100 p-2 rounded-full shadow hover:bg-gray-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Chips container */}
      <div
        ref={containerRef}
        className="flex space-x-3 overflow-x-auto p-3 scrollbar-hide scroll-smooth"
      >
        {chips.map((current, index) => (
          <button
            key={index}
            ref={(el) => (chipRefs.current[index] = el)}
            onClick={() => handleClick(current, index)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${
                current === tab
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            {current}
          </button>
        ))}
      </div>

      {/* Right button - only desktop */}
      <button
        onClick={scrollRight}
        className="hidden md:flex bg-gray-100 p-2 rounded-full shadow hover:bg-gray-200"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
}
