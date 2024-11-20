import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, X } from "lucide-react";

const Interview = ({ onEndInterview }) => {
  const navigate = useNavigate();
  
  // Initialize all states first
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [timer, setTimer] = useState(0);
  const [formData, setFormData] = useState({
    role: "",
    difficulty: "Beginner",
    topic: "",
  });
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  // Initialize refs
  const videoRef = useRef(null);
  const timerInterval = useRef(null);
  const chatBodyRef = useRef(null);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isInterviewStarted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      timerInterval.current = interval;
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isInterviewStarted]);

  // Chat scroll effect
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Video handlers
  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsVideoEnabled(true);
      setIsAudioEnabled(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Unable to access camera or microphone. Please check your permissions.");
    }
  };

  const toggleVideo = () => {
    if (videoRef.current?.srcObject) {
      const videoTrack = videoRef.current.srcObject.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (videoRef.current?.srcObject) {
      const audioTrack = videoRef.current.srcObject.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
    }
  };

  // Interview handlers
  const startInterview = async () => {
    if (!formData.role || !formData.topic) {
      alert("Please fill out all required fields");
      return;
    }
    try {
      await startVideoStream();
      setIsInterviewStarted(true);
      // Add initial bot message
      setMessages([{
        role: "assistant",
        content: `Welcome to your ${formData.difficulty} level interview for the ${formData.role} position. Let's focus on ${formData.topic}. How ready do you feel?`
      }]);
    } catch (error) {
      console.error("Error starting interview:", error);
      alert("Failed to start interview. Please check your camera permissions.");
    }
  };

  const endInterview = () => {
    // Stop video stream
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Clear timer
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    
    // Reset states
    setIsInterviewStarted(false);
    setIsVideoEnabled(false);
    setTimer(0);

    
    // Generate mock stats
    const mockStats = {
      duration: timer,
      questionsAnswered: messages.filter(m => m.role === "user").length,
      performance: Math.floor(Math.random() * 30) + 70,
      feedback: {
        strengths: [
          "Strong problem-solving approach",
          "Clear communication style",
          "Good technical knowledge"
        ],
        improvements: [
          "Could elaborate more on solutions",
          "Consider alternative approaches",
          "Work on time management"
        ]
      }
    };
    
    if (typeof onEndInterview === 'function') {
      onEndInterview(mockStats);
    }
    
    // Navigate directly to feedback
    navigate('/feedback', { 
      state: { 
        stats: mockStats,
        interviewDetails: {
          role: formData.role,
          topic: formData.topic,
          difficulty: formData.difficulty
        }
      }
    });
};

  // Chat handlers
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      role: "user",
      content: inputMessage.trim()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=AIzaSyDnil_v2VBSMDsgbBEd-RnZoWoOmd-bJ_M`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: inputMessage }]
            }
          ]
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to get response");

      // Add bot response
      const botMessage = {
        role: "assistant",
        content: data.candidates[0].content.parts[0].text
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again."
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-16">
      {!isInterviewStarted ? (
        // Setup Form
        <div className="container mx-auto max-w-2xl bg-white shadow-lg rounded-lg p-8 md:p-16">
          <h1 className="text-5xl font-bold font-serif text-gray-800 mb-8 text-center">
            Interview Setup
          </h1>
          <form className="space-y-6">
            <div>
              <label className="block text-lg text-gray-600 mb-2">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div>
              <label className="block text-lg text-gray-600 mb-2">Difficulty Level</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-lg text-gray-600 mb-2">Focus Topic</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., React, Python"
              />
            </div>
            <button
              type="button"
              onClick={startInterview}
              className="w-full mt-8 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300"
            >
              Start Interview
            </button>
          </form>
        </div>
      ) : (
        // Interview Interface
        <div className="container mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-8 md:p-16">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Interviewer Section */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold font-serif text-gray-800">
                  Your Interviewer
                </h3>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-md">
                  <img
                    src="/public/images/interviewer.png"
                    alt="Interviewer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <div className="space-y-2 text-lg text-gray-600">
                    <p><span className="font-semibold">Role:</span> {formData.role}</p>
                    <p><span className="font-semibold">Topic:</span> {formData.topic}</p>
                    <p><span className="font-semibold">Level:</span> {formData.difficulty}</p>
                  </div>
                </div>
              </div>

              {/* Candidate Section */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold font-serif text-gray-800">
                  You
                </h3>
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-md">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-mono text-gray-700">
                    {formatTime(timer)}
                  </div>
                  <div className="space-x-4">
                    <button
                      onClick={toggleVideo}
                      className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors duration-300"
                    >
                      {isVideoEnabled ? "Disable Video" : "Enable Video"}
                    </button>
                    <button
                      onClick={toggleAudio}
                      className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors duration-300"
                    >
                      {isAudioEnabled ? "Mute" : "Unmute"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* End Interview Button */}
            <div className="mt-8 text-center">
              <button
                onClick={endInterview}
                className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-red-700 transition-colors duration-300"
              >
                End Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Toggle Button */}
        <button
    onClick={() => setShowChatbot(!showChatbot)}
    className="relative mb-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 flex items-center justify-center overflow-hidden"
  >
    <div
      className={`absolute transform transition-transform duration-300 ${
        showChatbot ? 'rotate-0' : 'rotate-180 scale-0'
      }`}
    >
      <X className="w-6 h-6" />
    </div>
    <div
      className={`absolute transform transition-transform duration-300 ${
        showChatbot ? 'rotate-180 scale-0' : 'rotate-0'
      }`}
    >
      <MessageSquare className="w-6 h-6" />
    </div>
  </button>

        {/* Chat Window */}
        {showChatbot && (
          <div className="w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h3 className="text-xl font-semibold">Interview Assistant</h3>
            </div>

            {/* Messages */}
            <div 
              ref={chatBodyRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[80%] ${
                    message.role === "user" ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <div
                    className={`p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interview;