import React, { createContext, useState } from 'react';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [videoList, setVideoList] = useState([]);
  const [currentVideoSrc, setCurrentVideoSrc] = useState('');

  return (
    <Context.Provider value={{ videoList, currentVideoSrc, setCurrentVideoSrc }}>
      {children}
    </Context.Provider>
  );
};
