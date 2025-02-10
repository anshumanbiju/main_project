import React from "react";
import { useNavigate } from "react-router-dom";
import "../StartPlayer/StartPlayer.css";
import backgroundImage from "../../assets/new1.png"; // Import the image

const StartPlayer = () => {
  const navigate = useNavigate();

  return (
    <div
      className="app-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="content-wrapper">
        <div className="text-section">
          <h1 className="title">v Plyr</h1>
          <p className="subtitle">
            Video player with in-built subtitles generator for English Language
          </p>
        </div>

        <div className="video-section">
          <video
            className="video-player"
            autoPlay
            controls
            controlsList="nodownload nofullscreen noplaybackrate"
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <button className="enter-button" onClick={() => navigate("/upload")}>
        Enter
      </button>
    </div>
  );
};

export default StartPlayer;
