// components/AudioVisualizer.js
import React from "react";

const AudioVisualizer = ({ label, color = "blue" }) => {
  const bars = Array(4).fill(0);
  const colorMap = { blue: "#3b82f6", green: "#22c55e" };
  const barColor = colorMap[color] || "#3b82f6";

  return (
    <div className="flex flex-col items-center justify-center h-full text-sm">
      <div className="flex space-x-1 mb-2">
        {bars.map((_, i) => (
          <div
            key={i}
            style={{
              width: "5px",
              backgroundColor: barColor,
              borderRadius: "4px",
              height: `${Math.floor(Math.random() * 20) + 8}px`,
              animation: `pulse 0.5s ease-in-out infinite ${i * 0.12}s`,
            }}
            className="origin-bottom"
          />
        ))}
      </div>
      <span className="font-semibold text-gray-700 bg-white/70 px-2 py-1 rounded-full text-xs shadow-sm">
        {label}
      </span>
    </div>
  );
};

export default AudioVisualizer;

// Inject animation globally
if (!document.getElementById("pulse-animation-style")) {
  const style = document.createElement("style");
  style.id = "pulse-animation-style";
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scaleY(1); }
      50% { transform: scaleY(1.8); }
    }
  `;
  document.head.appendChild(style);
}