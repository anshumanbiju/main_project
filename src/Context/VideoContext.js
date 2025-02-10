import React, { createContext, useState, useContext } from 'react';

// Create the context
export const VideoContext = createContext();

// Create the provider component
export const VideoContextProvider = ({ children }) => {
  // State for the list of videos and current video source
  const [videoList, setVideoList] = useState([]);
  const [currentVideoSrc, setCurrentVideoSrc] = useState('');

  // Return the provider with the value set for the context
  return (
    <VideoContext.Provider value={{ videoList, setVideoList, currentVideoSrc, setCurrentVideoSrc }}>
      {children}
    </VideoContext.Provider>
  );
};
