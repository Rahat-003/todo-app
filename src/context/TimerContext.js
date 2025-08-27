import React, { createContext, useState, useContext } from 'react';

const TimerContext = createContext();

export const useTimer = () => {
  return useContext(TimerContext);
};

export const TimerProvider = ({ children }) => {
  const [activeTimer, setActiveTimer] = useState(null);

  return (
    <TimerContext.Provider value={{ activeTimer, setActiveTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export { TimerContext };