// i have an mp3 file while the compoent is loaded i need to play that audio file // components/InterviewSetup.js
import React, { useState, useRef, useEffect } from "react";
import InterviewerView from "./Interview/InterviewerView";
import UserVideo from "./Interview/UserVideo";
import ChatBox from "./Interview/ChatBox";
import ControlButtons from "./Interview/ControlButtons";
import Snackbar from "./Interview/Snackbar";
import ShortcutTooltip from "./Interview/ShortcutTooltip";
const InterviewSetup = () => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [interviewerSpeaking, setInterviewerSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "interviewer",
      content: "Hello! Welcome to your interview session.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [mediaStream, setMediaStream] = useState(null);
  // const [userParagraph, setUserParagraph] = useState("");
  const [analyser, setAnalyser] = useState(null);
  const [snackbar, setSnackbar] = useState({ show: false, message: "" });
  const [snackbarTimeout, setSnackbarTimeout] = useState(null);
const [userResume, setUserResume] = useState("");     // ← Resume input
const [interviewQuestions, setInterviewQuestions] = useState([]);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const dataArrayRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const [hasStarted, setHasStarted] = useState(false);
const startInterview = () => {
  const audio = new Audio("/audio/intro.mp3");

  audio.play().catch((e) => console.error("Audio play error:", e));

  // Set hasStarted immediately (so UI shows chat, etc.)
  setHasStarted(true);

  // After audio ends + 12 seconds delay, start asking questions
  audio.onended = () => {
    setTimeout(() => {
      // Start asking questions one by one
      askQuestionsSequentially();
    }, 17000); // 12-second delay after audio ends
  };

  // Fallback: in case audio fails to play or onended doesn't fire
  setTimeout(() => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    setTimeout(askQuestionsSequentially, 17000);
  }, 2000);
};
const askQuestionsSequentially = () => {
  if (!interviewQuestions || interviewQuestions.length === 0) {
    // Fallback if no questions
    setMessages((prev) => [
      ...prev,
      {
        sender: "interviewer",
        content: "Let's begin. Can you tell me about yourself?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    return;
  }

  // Loop through questions with delay
  interviewQuestions.forEach((question, index) => {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "interviewer",
          content: question,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, index * 15000); // 15 seconds between each question
  });
};



  // Show snackbar with auto-hide
  const showSnackbar = (msg) => {
    if (snackbarTimeout) clearTimeout(snackbarTimeout);
    setSnackbar({ show: true, message: msg });
    const id = setTimeout(() => setSnackbar({ show: false, message: "" }), 5000);
    setSnackbarTimeout(id);
  };

  // Request camera & mic access
  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMediaStream(stream);
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.error("Video play error:", e));
        }

        // Audio context for visualization
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyserNode = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyserNode);
        analyserNode.fftSize = 128;
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        audioContextRef.current = audioCtx;
        setAnalyser(analyserNode);
        dataArrayRef.current = dataArray;

        const visualize = () => {
          if (!analyserNode || !dataArrayRef.current) return;
          analyserNode.getByteFrequencyData(dataArrayRef.current);
          const volume = dataArrayRef.current.reduce((a, b) => a + b) / bufferLength;
          setUserSpeaking(volume > 50);
          requestAnimationFrame(visualize);
        };
        visualize();

        // Send video frame to Flask for face detection
        const sendFrameToFlask = () => {
          if (!videoRef.current?.videoWidth || !videoRef.current?.videoHeight) return;
          const canvas = document.createElement("canvas");
          const video = videoRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append("image", blob, "frame.jpg");
            try {
              const res = await fetch("http://localhost:3000/detect-face", {
                method: "POST",
                body: formData,
              });
              const data = await res.json();
              if (data.message) {
                showSnackbar(data.message);
              }
            } catch (err) {
              console.error("Error sending frame to Flask:", err);
            }
          }, "image/jpeg");
        };

        const detectionInterval = setInterval(sendFrameToFlask, 2000);

        // Simulate interviewer speaking
        const speakingInterval = setInterval(() => {
          setInterviewerSpeaking((prev) => !prev);
        }, 3000);

        // Cleanup
        return () => {
          clearInterval(detectionInterval);
          clearInterval(speakingInterval);
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          }
          if (audioContextRef.current) {
            audioContextRef.current.close();
          }
        };
      } catch (err) {
        console.error("Error accessing media devices:", err);
        alert("Please allow camera and microphone permissions.");
      }
    };
    getMedia();
  }, []);

  const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  // Add user message
  const userMessage = {
    sender: "customer",
    content: inputValue,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");

  // Show "thinking..." indicator
  const typingMessage = {
    sender: "interviewer",
    content: "Thinking...",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    id: "typing",
  };
  setMessages((prev) => [...prev, typingMessage]);

  try {
    // ✅ Call YOUR backend (which talks to Gemini securely)
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: inputValue }),
    });

    const data = await response.json();

    // Remove "thinking..." message
    setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));

    if (!response.ok || data.error) {
      throw new Error(data.error || "Failed to get response");
    }

    // Add AI reply
    const aiMessage = {
      sender: "interviewer",
      content: data.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    console.error("Chat Error:", error);

    // Remove typing indicator
    setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));

    // Show error message
    const errorMessage = {
      sender: "interviewer",
      content: "Sorry, I couldn't reach the AI right now.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, errorMessage]);
  }
};

  const toggleMic = () => {
    if (!mediaStream) return;
    mediaStream.getAudioTracks().forEach((track) => {
      track.enabled = !isMicOn;
    });
    setIsMicOn(!isMicOn);
  };

  const toggleVideo = () => {
    if (!mediaStream) return;
    const videoTracks = mediaStream.getVideoTracks();
    if (videoTracks.length === 0) return;
    setIsVideoOn((prev) => {
      const newVideoState = !prev;
      videoTracks.forEach((track) => {
        track.enabled = newVideoState;
      });
      if (newVideoState && videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((e) => console.error("Error playing video:", e));
      }
      return newVideoState;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keyboard Shortcuts: Ctrl+D (mic), Ctrl+E (video)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (!isCtrlOrCmd) return;
      e.preventDefault();
      if (e.key.toLowerCase() === "d") toggleMic();
      else if (e.key.toLowerCase() === "e") toggleVideo();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleMic, toggleVideo]);


// if (!hasStarted) {
//   // Define state for paragraph input
//   // const [userParagraph, setUserParagraph] = useState("");

//   return (
//     <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
//       <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-lg w-full">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the Interview</h2>
//         <p className="text-gray-600 mb-6">Please share a short introduction or paste your resume:</p>

//         {/* Multi-line Text Area for Paragraph Input */}
//         <textarea
//           value={userResume}
//           onChange={(e) => setUserResume(e.target.value)}
//           placeholder="Paste your full resume here..."
//           rows={8}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-6 font-mono text-sm"
//         />

//         {/* Start Interview Button */}
//         <button
//           onClick={() => {
//             console.log("User Paragraph Entered:\n", userParagraph); // Log full input
//             startInterview(); // Start the interview
//           }}
//           className="px-6 py-3 text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 text-lg font-semibold"
//         >
//           Start Interview
//         </button>
//       </div>
//     </div>
//   );
// }
if (!hasStarted) {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the Interview</h2>
        <p className="text-gray-600 mb-6">Please paste your resume or bio to begin:</p>

        <textarea
          value={userResume}
          onChange={(e) => setUserResume(e.target.value)}
          placeholder="Paste your full resume here..."
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-6 font-mono text-sm"
        />

        <button
          onClick={async () => {
            if (!userResume.trim()) {
              alert("Please enter your resume first!");
              return;
            }

            console.log("Sending resume to http://localhost:4000/questions");
            try {
              const res = await fetch("http://localhost:4000/questions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ resume: userResume }),
              });

              const data = await res.json();

              if (res.ok && data.questions) {
                console.log("Received questions:", data.questions);
                setInterviewQuestions(data.questions); // Save questions
                startInterview(); // Proceed to start interview
              } else {
                console.error("Error from API:", data.error);
                alert("Failed to generate questions. Check console.");
              }
            } catch (err) {
              console.error("Network/Fetch error:", err);
              alert("Could not connect to the question generator. Is Flask running?");
            }
          }}
          className="px-6 py-3 text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 text-lg font-semibold w-full"
        >
          Generate Questions & Start Interview
        </button>
      </div>
    </div>
  );
}
 return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 flex flex-col relative font-sans">
      {/* Title */}
      <div className="p-5 text-center border-b border-gray-200/50 shadow-sm bg-white/80 backdrop-blur-md">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Interview Room
        </h1>
      </div>

      {/* Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-5 p-5 h-full">
        {/* Left: Interviewer */}
        <div className="lg:col-span-3 flex flex-col space-y-5">
          <InterviewerView interviewerSpeaking={interviewerSpeaking} />
        </div>

        {/* Right Column: User Video + Chat */}
        <div className="lg:col-span-2 flex flex-col space-y-5">
          {/* User Video (Top-Right) */}
          <UserVideo
            videoRef={videoRef}
            isVideoOn={isVideoOn}
            isMicOn={isMicOn}
            userSpeaking={userSpeaking}
          />

          {/* Chat Box (Below Video) */}
          <div className="h-100">
          <ChatBox
            messages={messages}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSendMessage={handleSendMessage}
            messagesEndRef={messagesEndRef}
          />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-10">
        <ControlButtons
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
          toggleMic={toggleMic}
          toggleVideo={toggleVideo}
        />
      </div>

      {/* Shortcut Tooltip */}
      <ShortcutTooltip />

      {/* Snackbar */}
      <Snackbar show={snackbar.show} message={snackbar.message} />
    </div>
  );
  };

// export default InterviewSetup;
export default InterviewSetup;
// Add this to your app's entry point or use a layout