// components/ShortcutTooltip.js
import React from "react";

const ShortcutTooltip = () => (
  <div className="absolute top-5 right-5 bg-white/90 text-gray-700 px-4 py-2 rounded-full shadow-lg text-xs backdrop-blur-sm hidden sm:block">
    <span className="font-medium">⌨️</span>
    <kbd className="px-2 py-1 mx-1 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+D</kbd>
    <span className="mx-1">|</span>
    <kbd className="px-2 py-1 mx-1 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+E</kbd>
  </div>
);

export default ShortcutTooltip;