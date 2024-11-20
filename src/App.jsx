import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Landing from "./Components/Landing";
import Login from "./Components/Login";
import Interview from "./Components/Interview";
import Feedback from "./Components/Feedback";

function App() {
  const [interviewStats, setInterviewStats] = useState(null);

  const handleEndInterview = (stats) => {
    setInterviewStats(stats);
  };

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/interview"
            element={<Interview onEndInterview={handleEndInterview} />}
          />
          <Route 
            path="/feedback" 
            element={<Feedback stats={interviewStats} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;