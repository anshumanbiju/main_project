import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProcessingScreen.scss";

const ProcessingScreen = () => {
  const [progress, setProgress] = useState(0); // State to keep track of progress
  const [videoFile, setVideoFile] = useState(null); // State to hold video file
  const [subtitleFile, setSubtitleFile] = useState(null); // State to hold subtitle file
  const location = useLocation();
  const navigate = useNavigate();
  const { videoFile: uploadedVideoFile } = location.state || {};

  useEffect(() => {
    if (!uploadedVideoFile) {
      return;
    }

    const formData = new FormData();
    formData.append("videoFile", uploadedVideoFile);

    const uploadVideo = async () => {
      try {
        // Step 1: Upload the video to the backend
        const response = await fetch("http://127.0.0.1:5000/generate-subtitles", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to process video");
        }

        const data = await response.json();
        const { taskId } = data;

        console.log("Task ID:", taskId);

        // Step 2: Poll for progress updates
        const interval = setInterval(async () => {
          const progressResponse = await fetch(`http://127.0.0.1:5000/progress/${taskId}`);
          const progressData = await progressResponse.json();

          console.log("Progress Data:", progressData);  // Check the response here

          // Step 3: Update the progress bar with the latest progress
          if (progressData && progressData.progress !== undefined) {
            setProgress(progressData.progress);
          }

          // Step 4: If processing is complete, fetch subtitle file and navigate
          if (progressData.progress === 100) {
            clearInterval(interval); // Stop polling when done

            // Fetch the subtitle file after processing completion
            const subtitleResponse = await fetch(`http://127.0.0.1:5000/download/${taskId}`);
            const subtitleBlob = await subtitleResponse.blob();
            setSubtitleFile(new File([subtitleBlob], "generated-subtitles.srt"));

            setVideoFile(uploadedVideoFile);
            navigate("/upload2", { 
              state: { videoFile: uploadedVideoFile, subtitleFile: new File([subtitleBlob], "generated-subtitles.srt") }
            });
          }
        }, 2000);  // Poll every 2 seconds for progress
      } catch (error) {
        console.error("Error processing video:", error);
      }
    };

    uploadVideo();
  }, [uploadedVideoFile, navigate]);

  return (
    <div className="progress-card">
      <div className="processing-container">
        <h2>Processing.......</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }} // Corrected interpolation syntax
          ></div>
        </div>
        <div className="progress-text">
          {progress}% Complete
        </div>
      </div>
    </div>
  );
};

export default ProcessingScreen;
