import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ duration, onComplete, taskId, globalStartTracker, setGlobalStartTracker, setIsTimerOrCountDownRunning }) => {

  let [timeLeft, setTimeLeft] = useState(duration * 60 * 1000); // Convert minutes to ms
  console.log("duration =", duration, "timeLeft =", timeLeft/(60*1000));
  const [isRunning, setIsRunning] = useState(false);
  const [isActive, setIsActive] = useState(false);


  
  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1000);
      }, 1000);
    } else if (timeLeft <= 0) {
      clearInterval(interval);
      setIsActive(false);
      if (isRunning) {
        setIsRunning(false);
        onComplete(taskId, duration * 60 * 1000); // Notify parent of completion
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete, taskId, duration]);

  const handleStart = () => {
    if (globalStartTracker) return;
    setIsActive(() => true);
    setGlobalStartTracker(() => true);
    setIsTimerOrCountDownRunning(() => true);
    setIsRunning(true);
  };

  const handleStop = () => {
    setGlobalStartTracker(() => false);
    setIsTimerOrCountDownRunning(() => false);
    setIsRunning(false);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / 1000 / 60 / 60));

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <div className="countdown-timer">
      <div className="timer-display">{isActive ? formatTime(timeLeft) : formatTime(duration * 60 * 1000)}</div>
      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={handleStart} className="timer-btn start" disabled={globalStartTracker}>
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

export default CountdownTimer;