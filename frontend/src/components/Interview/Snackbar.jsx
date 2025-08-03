// components/Snackbar.js
import React from "react";

const Snackbar = ({ show, message }) => {
  if (!show) return null;

  // Inject animation
  if (!document.getElementById("snackbar-styles")) {
    const style = document.createElement("style");
    style.id = "snackbar-styles";
    style.textContent = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.3s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
  }

  return (
    <div className="fixed top-6 right-6 z-50 animate-fade-in-up pointer-events-none">
      <div className="px-4 py-3 rounded-lg shadow-lg text-sm max-w-xs bg-red-500 text-white">
        {message}
      </div>
    </div>
  );
};

export default Snackbar;