import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ duration, onComplete, taskId }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60 * 1000); // Convert minutes to ms
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1000);
      }, 1000);
    } else if (timeLeft <= 0) {
      clearInterval(interval);
      if (isRunning) {
        setIsRunning(false);
        onComplete(taskId, duration * 60 * 1000); // Notify parent of completion
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete, taskId, duration]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
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
      <div className="timer-display">{formatTime(timeLeft)}</div>
      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={handleStart} className="timer-btn start">
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