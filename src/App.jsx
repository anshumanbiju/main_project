import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPlayer from "./components/StartPlayer/StartPlayer";
import UploadPage from "./components/UploadPage/UploadPage";
import UploadPage2 from "./components/UploadPage2/UploadPage2";
import OptionsPage from "./components/OptionsPage/OptionsPage";
import VideoPlayerPage from "./components/VideoPlayerPage/VideoPlayerPage";
import VideoPlayerPage2 from "./components/VideoPlayerPage2/VideoPlayerPage2"; // New import
import ProcessingScreen from "./components/ProcessPage/ProcessingScreen";

import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPlayer />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/upload2" element={<UploadPage2 />} />
        <Route path="/options" element={<OptionsPage />} />
        <Route path="/processing" element={<ProcessingScreen />} />
        <Route path="/video-player" element={<VideoPlayerPage />} />
        <Route path="/video-player2" element={<VideoPlayerPage2 />} /> {/* New route for VideoPlayerPage2 */}
      </Routes>
    </Router>
  );
};

export default App;
