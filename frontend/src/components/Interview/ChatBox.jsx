// components/ChatBox.js
import React from "react";
import { IoSend } from "react-icons/io5";

const ChatBox = ({ messages, inputValue, setInputValue, handleSendMessage, messagesEndRef }) => {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl flex flex-col border border-gray-200/60 shadow-xl h-[500px] sm:h-[600px]">
      <div className="p-3 border-b border-gray-200/50">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          💬 <span>Live Chat</span>
        </h3>
      </div>
      <div className="flex-1 p-3 overflow-y-auto space-y-5" style={{ contain: 'layout' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-2.5 rounded-2xl leading-tight break-words ${
              msg.sender === "customer"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto shadow-md"
                : "bg-gray-100 text-gray-800 border border-gray-200"
            }`}
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word', hyphens: 'auto' }}
          >
            <p className="whitespace-pre-wrap m-0 leading-relaxed">{msg.content}</p>
            <span className="text-xs block mt-1 opacity-80">{msg.timestamp}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-gray-200/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 border border-gray-300/70 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-400 truncate"
            maxLength={200}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-full p-2 text-sm transition-all shadow-md hover:shadow-lg active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;