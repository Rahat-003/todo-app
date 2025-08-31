import React, { useState, useEffect, useRef } from "react";

const CountdownTimer = ({
    duration,
    onComplete,
    taskId,
    globalStartTracker,
    setGlobalStartTracker,
    setIsTimerOrCountDownRunning,
}) => {
    const [timeLeft, setTimeLeft] = useState(duration * 60 * 1000);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const initialDurationRef = useRef(duration);

    useEffect(() => {
        if (!isRunning) {
            setTimeLeft(duration * 60 * 1000);
            initialDurationRef.current = duration;
        }
    }, [duration, isRunning]);

    // const now = new Date();
    // const hours = now.getHours().toString().padStart(2, "0");
    // const minutes = now.getMinutes().toString().padStart(2, "0");
    // const seconds = now.getSeconds().toString().padStart(2, "0");
    // const ms = now.getMilliseconds().toString().padStart(3, "0");

    // if (globalStartTracker) {
    //   console.log(`Current Time: ${hours}:${minutes}:${seconds}.${ms}`);
    // }

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    const newTime = prevTime - 1000;
                    if (newTime <= 0) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        setGlobalStartTracker(false);
                        setIsTimerOrCountDownRunning(false);
                        onComplete(
                            taskId,
                            initialDurationRef.current * 60 * 1000
                        );
                        return 0;
                    }
                    return newTime;
                });
            }, 1000); // Changed to 1000ms
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [
        isRunning,
        onComplete,
        taskId,
        setGlobalStartTracker,
        setIsTimerOrCountDownRunning,
    ]);

    const handleStart = () => {
        if (globalStartTracker) return;
        setIsRunning(true);
        setGlobalStartTracker(true);
        setIsTimerOrCountDownRunning(true);
        initialDurationRef.current = duration;
    };

    const handleStop = () => {
        setIsRunning(false);
        setGlobalStartTracker(false);
        setIsTimerOrCountDownRunning(false);
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [
            hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            seconds.toString().padStart(2, "0"),
        ].join(":");
    };

    return (
        <div className="countdown-timer">
            <div className="timer-display">
                {formatTime(isRunning ? timeLeft : duration * 60 * 1000)}
            </div>
            <div className="timer-controls">
                {!isRunning ? (
                    <button
                        onClick={handleStart}
                        className="timer-btn start"
                        disabled={globalStartTracker}
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

export default CountdownTimer;
