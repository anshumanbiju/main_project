import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatTime } from '../../utils/formatTime';
import 'remixicon/fonts/remixicon.css';
import './VideoPlayerPage2.scss';

const VideoPlayerPage2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { videoSrc, subtitleSrc } = location.state || {};

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [isMute, setIsMute] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const [currentSec, setCurrentSec] = useState(0);

  const videoRef = useRef(null);
  const videoRangeRef = useRef(null);
  const volumeRangeRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stop = () => {
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setCurrentSec(0);
    setIsPlaying(false);
  };

  const handleVideoRange = () => {
    videoRef.current.currentTime = videoRangeRef.current.value;
    setCurrentSec(videoRangeRef.current.value);
  };

  const handleVolumeRange = () => {
    let volume = parseFloat(volumeRangeRef.current.value);
    videoRef.current.volume = volume;
    setCurrentVolume(volume);
    setIsMute(volume === 0);
  };

  const handleMute = () => {
    if (isMute) {
      videoRef.current.volume = currentVolume || 0.5;
    } else {
      videoRef.current.volume = 0;
    }
    setIsMute(!isMute);
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      const updateTime = () => {
        setCurrentSec(videoRef.current.currentTime);
        videoRangeRef.current.value = videoRef.current.currentTime;
      };

      const updateDuration = () => {
        setDurationSec(videoRef.current.duration);
      };

      videoRef.current.addEventListener('loadedmetadata', updateDuration);
      videoRef.current.addEventListener('timeupdate', updateTime);
      videoRef.current.addEventListener('ended', () => setIsPlaying(false));

      return () => {
        videoRef.current.removeEventListener('loadedmetadata', updateDuration);
        videoRef.current.removeEventListener('timeupdate', updateTime);
        videoRef.current.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, []);

  return (
    <div className="VideoPlayerPage2">
      <video ref={videoRef} src={videoSrc} onClick={handlePlayPause} controls={false}>
        {subtitleSrc && (
          <track label="English Subtitles" kind="subtitles" srcLang="en" src={subtitleSrc} default />
        )}
      </video>

      <div className="VideoPlayerPage2__subtitle">
        <input type="file" accept=".vtt" style={{ display: 'none' }} />
      </div>

      {/* Control Panel */}
      <div className="VideoPlayerPage2__controls">
        <button className="control-button" onClick={handlePlayPause}>
          <i className={`ri-${isPlaying ? 'pause' : 'play'}-fill`}></i>
        </button>

        <button className="control-button" onClick={stop}>
          <i className="ri-stop-fill"></i>
        </button>

        <input
          type="range"
          className="video-range"
          ref={videoRangeRef}
          onChange={handleVideoRange}
          max={durationSec}
          value={currentSec}
          min={0}
        />

        <span className="time">
          {formatTime(currentSec)} / {formatTime(durationSec)}
        </span>

        <button className="control-button" onClick={handleMute}>
          <i className={`ri-volume-${isMute ? 'mute' : 'up'}-fill`}></i>
        </button>

        <input
          type="range"
          className="volume-range"
          ref={volumeRangeRef}
          max={1}
          min={0}
          step={0.1}
          value={currentVolume}
          onChange={handleVolumeRange}
        />

        <button className="control-button" onClick={handleFullScreen}>
          <i className="ri-fullscreen-line"></i>
        </button>
      </div>
    </div>
  );
};

export default VideoPlayerPage2;
