import React, { useState, useEffect } from 'react';

const CountdownTimer = ({
    duration,
    onComplete,
    onStart,
    onStop,
    taskId,
    isActive,
    isRunning,
}) => {
    const [timeLeft, setTimeLeft] = useState(duration * 60 * 1000);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        setTimeLeft(duration * 60 * 1000);
    }, [duration]);

    useEffect(() => {
        let interval = null;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1000);
            }, 1000);
        } else if (timeLeft <= 0 && isRunning) {
            clearInterval(interval);
            setIsCompleted(true);
            onComplete(taskId, duration * 60 * 1000);

            setTimeout(() => {
                setIsCompleted(false);
                setTimeLeft(duration * 60 * 1000);
            }, 2000);
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, onComplete, taskId, duration]);

    const handleStart = () => {
        if (!isActive) return;
        setTimeLeft(duration * 60 * 1000);
        onStart();
    };

    const handleStop = () => {
        onStop();
    };

    const formatTime = (ms) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / 1000 / 60) % 60);
        const hours = Math.floor(ms / 1000 / 60 / 60);

        return [
            hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            seconds.toString().padStart(2, "0"),
        ].join(":");
    };

    const progress = 100 - (timeLeft / (duration * 60 * 1000)) * 100;

    return (
        <div className={`countdown-timer ${isCompleted ? "completed" : ""}`}>
            <div className="timer-visual">
                <div className="circular-progress">
                    <svg className="progress-ring" width="80" height="80">
                        <circle
                            className="progress-ring-circle"
                            strokeWidth="4"
                            strokeLinecap="round"
                            stroke={isRunning ? "#667eea" : "#a0aec0"}
                            fill="transparent"
                            r="34"
                            cx="40"
                            cy="40"
                            style={{
                                strokeDasharray: 213.63,
                                strokeDashoffset:
                                    213.63 - (progress * 213.63) / 100,
                            }}
                        />
                    </svg>
                    <div className="timer-display">{formatTime(timeLeft)}</div>
                </div>
            </div>

            <div className="timer-controls">
                {!isRunning ? (
                    <button
                        onClick={handleStart}
                        disabled={!isActive || timeLeft <= 0}
                        className="timer-btn start"
                    >
                        <span className="btn-icon">▶</span>
                        Start
                    </button>
                ) : (
                    <button onClick={handleStop} className="timer-btn stop">
                        <span className="btn-icon">⏸</span>
                        Stop
                    </button>
                )}
            </div>

            {isCompleted && (
                <div className="completion-animation">
                    <div className="confetti">🎉</div>
                    <div className="completion-text">Time's up!</div>
                </div>
            )}
        </div>
    );
};

export default CountdownTimer;