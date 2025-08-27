import React, { useState, useEffect } from 'react';

const Timer = ({ onSessionComplete, isActive, globalStartTracker, setGlobalStartTracker }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && isActive) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, startTime, isActive]);

  const handleStart = () => {
    if (!isActive || globalStartTracker) return;
    setGlobalStartTracker(() => true);
    
    setIsRunning(true);
    setStartTime(Date.now() - elapsedTime);
  };

  const handleStop = () => {
    if (!isRunning) return;
    setGlobalStartTracker(() => false);
    setIsRunning(false);
    
    if (onSessionComplete) {
      onSessionComplete({
        startTime: startTime,
        endTime: Date.now()
      });
    }
    
    setElapsedTime(0);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <div className="timer">
      <div className="timer-display">{formatTime(elapsedTime)}</div>
      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={handleStart} disabled={!isActive || globalStartTracker} className="timer-btn start">
            Start
          </button>
        ) : (
          <button onClick={handleStop} className="timer-btn stop">
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;