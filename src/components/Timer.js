import React, { useState, useEffect, useContext } from "react";
import { TimerContext } from "../context/TimerContext";

const Timer = ({ onSessionComplete, isActive, isRunning, onStart, onStop }) => {
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const { activeTimer, setActiveTimer } = useContext(TimerContext);

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
        if (!isActive) return;

        setStartTime(Date.now() - elapsedTime);
        onStart();
    };

    const handleStop = () => {
        if (!isRunning) return;

        onStop();

        if (onSessionComplete) {
            onSessionComplete({
                startTime: startTime,
                endTime: Date.now(),
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
            hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            secs.toString().padStart(2, "0"),
        ].join(":");
    };

    return (
        <div className="timer">
            <div className="timer-display">{formatTime(elapsedTime)}</div>
            <div className="timer-controls">
                {!isRunning ? (
                    <button
                        onClick={handleStart}
                        disabled={!isActive}
                        className="timer-btn start"
                    >
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
