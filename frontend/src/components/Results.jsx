import { useLocation } from "react-router-dom";

export default function Results() {
  const location = useLocation();
  const chatHistory = location.state?.chatHistory || [];

  return (
    <div>
      {chatHistory.length === 0 ? (
        <p>No chat history available.</p>
      ) : (
        chatHistory
          .filter(msg => msg && msg.sender) // filter out any bad entries
          .map((msg, index) => (
            <div key={index}>
              <strong>{msg.sender}</strong>: {msg.text}
            </div>
          ))
      )}
    </div>
  );
}
