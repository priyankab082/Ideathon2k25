// // components/ControlButtons.js
// import React from "react";
// import { FaMicrophone } from "react-icons/fa6";
// import { IoMdMicOff } from "react-icons/io";
// import { IoVideocam } from "react-icons/io5";
// import { IoVideocamOff } from "react-icons/io5";
// const ControlButtons = ({ isMicOn, isVideoOn, toggleMic, toggleVideo }) => {
//   return (
//     <div className="flex space-x-2">
//       <button
//         onClick={toggleMic}
//         className={`flex items-center justify-center rounded-full w-10 h-10 transition-all duration-200 hover:scale-105 ${
//           isMicOn ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-400"
//         }`}
//         title="Toggle Microphone (Ctrl+D)"
//       >
//         {isMicOn ? (
//          <FaMicrophone />
//         ) : (
//           <IoMdMicOff />
//         )}
//       </button>
//       <button
//         onClick={toggleVideo}
//         className={`flex items-center justify-center rounded-full w-10 h-10 transition-all duration-200 hover:scale-105 ${
//           isVideoOn ? "bg-blue-100 text-blue-500" : "bg-gray-100 text-gray-400"
//         }`}
//         title="Toggle Video (Ctrl+E)"
//       >
//         {isVideoOn ? (
//           <IoVideocam />
//         ) : (
//           <IoVideocamOff />
//         )}
//       </button>
//     </div>
//   );
// };

// export default ControlButtons;
// components/ControlButtons.js
import React from "react";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";

const ControlButtons = ({ isMicOn, isVideoOn, toggleMic, toggleVideo }) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={toggleMic}
        className={`flex items-center justify-center rounded-full w-16 h-16 sm:w-20 sm:h-20 transition-all duration-200 hover:scale-105 ${
          isMicOn ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-400"
        }`}
        title="Toggle Microphone (Ctrl+D)"
      >
        {isMicOn ? (
          <FaMicrophone className="w-8 h-8" />
        ) : (
          <FaMicrophoneSlash className="w-8 h-8" />
        )}
      </button>
      <button
        onClick={toggleVideo}
        className={`flex items-center justify-center rounded-full w-16 h-16 sm:w-20 sm:h-20 transition-all duration-200 hover:scale-105 ${
          isVideoOn ? "bg-blue-100 text-blue-500" : "bg-gray-100 text-gray-400"
        }`}
        title="Toggle Video (Ctrl+E)"
      >
        {isVideoOn ? (
          <FaVideo className="w-8 h-8" />
        ) : (
          <FaVideoSlash className="w-8 h-8" />
        )}
      </button>
    </div>
  );
};

export default ControlButtons;