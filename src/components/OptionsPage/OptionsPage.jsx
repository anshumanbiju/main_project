import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../OptionsPage/OptionsPage.css";
import backgroundImage from "../../assets/new1.png"; // Import background image

const OptionsPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { videoFile } = location.state || {};

  const handleOptionClick = (action) => {
    if (action === "play") {
      // Navigate to video player with the uploaded video
      navigate("/video-player", { state: { videoSrc: URL.createObjectURL(videoFile) } });
    } else if (action === "subtitle") {
      // Navigate to the processing page for subtitle generation, passing the video file
      navigate("/processing", { state: { videoFile, action } });
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        navigate("/video-player", { state: { videoFile, action } });
      }, 5000); // Increased processing time to 5 seconds
    }
  };

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="back-button-box">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back
        </button>
      </div>

      {isProcessing ? (
        <div className="processing-container">
          <h1>Processing...</h1>
          <div className="loading-bar"></div>
        </div>
      ) : (
        <>
          <div className="upload-card">
            <h1 className="title">Choose an Option</h1>

            {/* Name Box to display the video file name */}
            {videoFile && (
              <div className="video-name-box">
                <label htmlFor="video-name">Uploaded Video Name:</label>
                <input
                  id="video-name"
                  type="text"
                  value={videoFile.name}
                  readOnly
                  className="video-name-input"
                />
              </div>
            )}
          </div>

          <div className="options-grid">
            <button
              className="option-button"
              onClick={() => handleOptionClick("subtitle")}
            >
              Generate Subtitle
            </button>
            <button
              className="option-button"
              onClick={() => handleOptionClick("play")}
            >
              Play Video
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OptionsPage;
