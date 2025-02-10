import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./UploadPage2.css";

// Function to convert SRT content to VTT format
const convertSrtToVtt = (srtContent) => {
  let vttContent = ['WEBVTT\n\n']; // VTT files need to start with "WEBVTT"
  const srtLines = srtContent.split("\n");
  let buffer = [];

  srtLines.forEach((line) => {
    if (line.trim() === "") {
      // Join the buffered lines and push them with a blank line
      if (buffer.length) {
        vttContent.push(buffer.join("\n"));
        vttContent.push(""); // Ensure a blank line between captions
        buffer = [];
      }
    } else if (line.includes("-->")) {
      // Replace commas with dots in timestamps
      line = line.replace(/,/g, ".");
      buffer.push(line);
    } else {
      buffer.push(line);
    }
  });

  return vttContent.join("\n");
};

const UploadPage2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { videoFile, subtitleFile } = location.state || {};

  // Handle video playback navigation
  const handlePlayVideo = () => {
    if (subtitleFile) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const srtContent = e.target.result;

        // Convert SRT to VTT
        const vttContent = convertSrtToVtt(srtContent);

        // Create a Blob for the VTT file and trigger download
        const vttBlob = new Blob([vttContent], { type: "text/vtt" });
        const vttUrl = URL.createObjectURL(vttBlob);

        // Trigger VTT file download (this is optional if you just want to pass the file)
        const link = document.createElement("a");
        link.href = vttUrl;
        link.download = subtitleFile.name.replace(/\.srt$/, ".vtt");
        link.click();

        // Navigate to the video player (now VideoPlayerPage2)
        navigate("/video-player2", {
          state: {
            videoSrc: URL.createObjectURL(videoFile),
            subtitleSrc: vttUrl, // Passing subtitle URL to VideoPlayerPage2
          },
        });
      };

      // Read the subtitle file as text
      reader.readAsText(subtitleFile);
    } else {
      alert("No subtitle file available for conversion.");
    }
  };

  // Handle subtitle download
  const handleDownloadSubtitle = () => {
    if (subtitleFile) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(subtitleFile);
      link.download = subtitleFile.name || "subtitle.srt";
      link.click();
    } else {
      alert("No subtitle file available for download.");
    }
  };

  return (
    <div className="upload-page-container">
      <div className="back-button-box">
        <button className="back-button" onClick={() => navigate(-2)}>
          ← Back
        </button>
      </div>
      <h1 className="page-title">v Plyr</h1>
      <div className="result-card">
        <h2 className="subtitle-title">Subtitle Generated</h2>
        <p className="subtitle-file-name">{subtitleFile ? subtitleFile.name : "video2.srt"}</p>

        <div className="button-container">
          <button className="action-button" onClick={handleDownloadSubtitle}>
            Download Subtitle
          </button>
          <button className="action-button" onClick={handlePlayVideo}>
            Play Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage2;
