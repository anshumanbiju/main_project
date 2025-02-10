import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../UploadPage/UploadPage.css";
import backgroundImage from "../../assets/new1.png"; // Import the background image

const UploadPage2 = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div
      className="app-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="back-button-box">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back
        </button>
      </div>
      <div className="home-button-box">
        <button className="home-button" onClick={() => navigate("/")}>
          Home
        </button>
      </div>

      <div className="upload-box">
      <p className="head-name">Upload Your Video File</p>
        <input
          id="file-input"
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button className="browse-button" onClick={() => document.getElementById("file-input").click()}>
          Browse File
        </button>

        {selectedFile && <p className="file-name">Selected: {selectedFile.name}</p>}
      </div>

      <button
        className="continue-button"
        disabled={!selectedFile}
        onClick={() => navigate("/options", { state: { videoFile: selectedFile } })}
      >
        Continue
      </button>
    </div>
  );
};

export default UploadPage2;
