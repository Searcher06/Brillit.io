/* eslint-disable react/prop-types */
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Recommendation({ user, recommended, tab, setTab, setActive, setError }) {
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

  const scrollLeft = () => containerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  const scrollRight = () => containerRef.current?.scrollBy({ left: 200, behavior: "smooth" });

  const chips = user?.suggestedKeywords?.length > 0 ? user.suggestedKeywords : recommended;

  return (
    <section className="flex items-center gap-2 px-2 sm:pl-20 sm:pr-4 py-3">
      {/* Left arrow — desktop only */}
      <button
        onClick={scrollLeft}
        className="hidden md:flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 transition-all hover:bg-white/10"
        style={{ color: "#6b7280", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Chips */}
      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth py-1"
      >
        {chips.map((current, index) => (
          <button
            key={index}
            ref={(el) => (chipRefs.current[index] = el)}
            disabled={tab === current}
            onClick={() => handleClick(current, index)}
            className={`chip flex-shrink-0 ${current === tab ? "chip-active" : ""}`}
          >
            {current}
          </button>
        ))}
      </div>

      {/* Right arrow — desktop only */}
      <button
        onClick={scrollRight}
        className="hidden md:flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 transition-all hover:bg-white/10"
        style={{ color: "#6b7280", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <ChevronRight size={16} />
      </button>
    </section>
  );
}
