// components/InterviewRoom.js
import React, { useRef, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import InterviewerView from "./Interview/InterviewerView";
import UserVideo from "./Interview/UserVideo";
import ChatBox from "./Interview/ChatBox";
import ControlButtons from "./Interview/ControlButtons";
import Snackbar from "./Interview/Snackbar";
import ShortcutTooltip from "./Interview/ShortcutTooltip";

// Reducer for managing local state
const interviewReducer = (state, action) => {
  switch (action.type) {
    case "SET_INTERVIEWER_SPEAKING":
      return { ...state, interviewerSpeaking: action.payload };
    case "SET_USER_SPEAKING":
      return { ...state, userSpeaking: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_INPUT_VALUE":
      return { ...state, inputValue: action.payload };
    case "SET_MEDIA_STREAM":
      return { ...state, mediaStream: action.payload };
    case "SET_ANALYSER":
      return { ...state, analyser: action.payload };
    case "SHOW_SNACKBAR":
      return { ...state, snackbar: { show: true, message: action.payload } };
    case "HIDE_SNACKBAR":
      return { ...state, snackbar: { show: false, message: "" } };
    default:
      return state;
  }
};

const InterviewRoom = ({ userResume, interviewQuestions }) => {
  const initialState = {
    isMicOn: false,
    isVideoOn: true,
    interviewerSpeaking: false,
    userSpeaking: false,
    messages: [
      {
        sender: "interviewer",
        content: "Hello! Welcome to your interview session.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ],
    inputValue: "",
    mediaStream: null,
    analyser: null,
    snackbar: { show: false, message: "" },
  };

  const [state, dispatch] = useReducer(interviewReducer, initialState);
  const { messages, inputValue, isMicOn, isVideoOn, interviewerSpeaking, userSpeaking, mediaStream, snackbar } = state;

  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const dataArrayRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  const isRecognitionRunning = useRef(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [timer, setTimer] = useState(null); // Active timeout
  const [timeLeft, setTimeLeft] = useState(60); // Timer for display
  const [timerActive, setTimerActive] = useState(false);

  // ✅ NEW: Store full chat history
  const [fullChatHistory, setFullChatHistory] = useState([]);

  // ✅ NEW: Navigation hook
  const navigate = useNavigate();

  // Update fullChatHistory whenever messages change
  useEffect(() => {
    setFullChatHistory([...messages]);
  }, [messages]);

  // Text-to-Speech
  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.name === "Google US English" || v.name === "Samantha") ||
                          voices.find(v => v.lang === "en-US") ||
                          voices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.rate = 0.9;
      utterance.pitch = 1;
    }

    dispatch({ type: "SET_INTERVIEWER_SPEAKING", payload: true });
    utterance.onend = () => dispatch({ type: "SET_INTERVIEWER_SPEAKING", payload: false });
    utterance.onerror = () => dispatch({ type: "SET_INTERVIEWER_SPEAKING", payload: false });

    window.speechSynthesis.speak(utterance);
  };

  // Start 1-minute countdown
  const startAnswerTimer = () => {
    setTimeLeft(60);
    setTimerActive(true);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          dispatch({ type: "ADD_MESSAGE", payload: {
            sender: "interviewer",
            content: "⏰ Time's up! Moving to the next question.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }});
          if (isMicOn) {
            mediaStream?.getAudioTracks().forEach(t => t.enabled = false);
            dispatch({ type: "SET_MIC", payload: false });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimer(interval);
  };

  // Cancel timer
  const cancelAnswerTimer = () => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    if (timerActive) {
      setTimerActive(false);
      setTimeLeft(60);
    }
  };

  // Ask questions from #11 and exclude last
  useEffect(() => {
    const askQuestionsFrom11 = () => {
      let questions = [...interviewQuestions].slice(0, -1); // Remove last
      if (questions.length <= 10) {
        dispatch({ type: "ADD_MESSAGE", payload: {
          sender: "interviewer",
          content: "No more questions available.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }});
        return;
      }
      questions = questions.slice(10); // Start from index 10 (11th)

      console.log("Asking from question 11 (excluding last):", questions);

      questions.forEach((question, index) => {
        setTimeout(() => {
          const cleanQuestion = question.replace(/^\d+\.\s*/, "").trim();
          const msg = {
            sender: "interviewer",
            content: cleanQuestion,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            id: `question-${index}`,
          };
          dispatch({ type: "ADD_MESSAGE", payload: msg });
          setCurrentQuestion(cleanQuestion);
          speakText(cleanQuestion);

          setTimeout(() => {
            startAnswerTimer();
          }, 2000); // Wait for speech to finish

        }, index * 80000); // 80s spacing
      });
    };

    const audio = new Audio("/audio/intro2.mp3");
    audio.play().catch(e => console.error("Intro audio error:", e));
    audio.onended = () => setTimeout(askQuestionsFrom11, 4000);
  }, [interviewQuestions]);

  // Speech Recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.warn("SpeechRecognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interimTranscript = "";
      finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        dispatch({ type: "SET_INPUT_VALUE", payload: finalTranscript + interimTranscript });
      }
    };

    recognition.onend = () => {
      isRecognitionRunning.current = false;
      if (finalTranscript.trim()) {
        dispatch({ type: "SET_INPUT_VALUE", payload: finalTranscript.trim() });
        handleSendMessage();
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      isRecognitionRunning.current = false;
      if (finalTranscript.trim()) {
        dispatch({ type: "SET_INPUT_VALUE", payload: finalTranscript.trim() });
        handleSendMessage();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (isRecognitionRunning.current) {
        recognition.stop();
      }
    };
  }, []);

  // Media setup
  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        dispatch({ type: "SET_MEDIA_STREAM", payload: stream });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.error("Video play error:", e));
        }

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 128;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        audioContextRef.current = audioCtx;
        dataArrayRef.current = dataArray;

        const visualize = () => {
          analyser.getByteFrequencyData(dataArrayRef.current);
          const volume = dataArrayRef.current.reduce((a, b) => a + b) / bufferLength;
          dispatch({ type: "SET_USER_SPEAKING", payload: volume > 50 });
          requestAnimationFrame(visualize);
        };
        visualize();

        const speakingInterval = setInterval(() => {
          dispatch({ type: "SET_INTERVIEWER_SPEAKING", payload: prev => !prev });
        }, 3000);

        return () => {
          clearInterval(speakingInterval);
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
          }
          if (audioContextRef.current) {
            audioContextRef.current.close();
          }
        };
      } catch (err) {
        console.error("Media error:", err);
        alert("Please allow camera and microphone access.");
      }
    };

    getMedia();
  }, []);

  const handleSendMessage = async () => {
    const answerText = inputValue.trim();
    if (!answerText) return;

    const userMsg = {
      sender: "customer",
      content: answerText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    dispatch({ type: "ADD_MESSAGE", payload: userMsg });
    dispatch({ type: "SET_INPUT_VALUE", payload: "" });

    cancelAnswerTimer();

    dispatch({ type: "ADD_MESSAGE", payload: {
      sender: "interviewer",
      content: "Evaluating...",
      id: "typing",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    } });

    try {
      const res = await fetch("http://localhost:4000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion, answer: answerText }),
      });
      const data = await res.json();

      dispatch({ type: "ADD_MESSAGE", payload: {
        sender: "interviewer",
        content: data.evaluation || "Thank you for your response.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }});
    } catch (err) {
      console.error("Evaluation error:", err);
      dispatch({ type: "ADD_MESSAGE", payload: {
        sender: "interviewer",
        content: "Response received. Evaluation pending.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }});
    } finally {
      dispatch({ type: "ADD_MESSAGE", payload: (prev) => prev.filter(m => m.id !== "typing") });
    }
  };

  const toggleMic = () => {
    if (!mediaStream) return;
    const tracks = mediaStream.getAudioTracks();
    tracks.forEach(t => (t.enabled = !isMicOn));

    if (!isMicOn) {
      if (recognitionRef.current && !isRecognitionRunning.current) {
        try {
          recognitionRef.current.start();
          isRecognitionRunning.current = true;
          console.log("🎤 Speech recognition started");
        } catch (err) {
          console.error("Speech recognition start error:", err);
        }
      }
    } else {
      if (recognitionRef.current && isRecognitionRunning.current) {
        recognitionRef.current.stop();
        isRecognitionRunning.current = false;
        console.log("🛑 Speech recognition stopped");
      }
    }

    dispatch({ type: "SET_MIC", payload: !isMicOn });
  };

  const toggleVideo = () => {
    if (!mediaStream) return;
    const videoTracks = mediaStream.getVideoTracks();
    videoTracks.forEach(t => (t.enabled = !isVideoOn));
    dispatch({ type: "SET_VIDEO", payload: !isVideoOn });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ NEW: End Interview Handler
  const endInterview = () => {
    // Optionally save fullChatHistory to localStorage or backend
    console.log("Full Chat History:", fullChatHistory);

    // Navigate to another component (e.g., /results)
    navigate("/results"); // Change to your desired route
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 flex flex-col relative font-sans">
      {/* Top Bar with End Interview Button */}
      <div className="p-4 flex justify-between items-center bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Interview Room
        </h1>
        <button
          onClick={endInterview}
          className="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-300 text-sm font-semibold"
        >
          End Interview
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-5 p-5 h-full">
        <div className="lg:col-span-3 flex flex-col space-y-5">
          <InterviewerView interviewerSpeaking={interviewerSpeaking} />
        </div>
        <div className="lg:col-span-2 flex flex-col space-y-5">
          <UserVideo
            videoRef={videoRef}
            isVideoOn={isVideoOn}
            isMicOn={isMicOn}
            userSpeaking={userSpeaking}
          />

          {/* Timer Display */}
          {timerActive && (
            <div className="text-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold shadow">
              ⏳ Time Left: <span className="text-lg">{formatTime(timeLeft)}</span>
            </div>
          )}

          <div className="h-full">
            <ChatBox
              messages={messages}
              inputValue={inputValue}
              setInputValue={(val) => dispatch({ type: "SET_INPUT_VALUE", payload: val })}
              handleSendMessage={handleSendMessage}
              messagesEndRef={messagesEndRef}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-10">
        <ControlButtons isMicOn={isMicOn} isVideoOn={isVideoOn} toggleMic={toggleMic} toggleVideo={toggleVideo} />
      </div>

      <ShortcutTooltip />
      <Snackbar show={snackbar.show} message={snackbar.message} />
    </div>
  );
};

export default InterviewRoom;