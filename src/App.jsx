import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Landing from './Components/Landing';
import Login from './Components/Login';
// import Signup from './components/Signup';
import Interview from './Components/Interview';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route path="/interview" element={<Interview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
