import React, { useState, useRef, useContext } from 'react';
import Timer from './Timer';
import CountdownTimer from './CountdownTimer';
import { TimerContext } from '../context/TimerContext';

const TodoItem = ({ task, index, onUpdateTask, onDeleteTask, onDragStart, onDragOver, onDrop, onDragEnd }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownDuration, setCountdownDuration] = useState(25);
  const itemRef = useRef(null);
  const { activeTimer, setActiveTimer } = useContext(TimerContext);

  const handleSave = () => {
    if (editName.trim() && editName.length <= 50) {
      onUpdateTask(task.id, { name: editName });
      setIsEditing(false);
    }
  };

  const handlePriorityChange = (priority) => {
    onUpdateTask(task.id, { priority });
  };

  const handleToggleComplete = () => {
    onUpdateTask(task.id, { completed: !task.completed });
  };

  const handleTimeSession = (session) => {
    const updatedSessions = [...task.timeSessions, session];
    onUpdateTask(task.id, { timeSessions: updatedSessions });
    setActiveTimer(null); // Reset active timer when session completes
  };

  const handleCountdownComplete = (taskId, timeSpent) => {
    const session = {
      startTime: Date.now() - timeSpent,
      endTime: Date.now(),
      duration: timeSpent
    };
    
    const updatedSessions = [...task.timeSessions, session];
    onUpdateTask(task.id, { timeSessions: updatedSessions });
    setShowCountdown(false);
    setActiveTimer(null); // Reset active timer when countdown completes
  };

  const handleCountdownStart = () => {
    setActiveTimer(task.id);
  };

  const handleCountdownStop = () => {
    setActiveTimer(null);
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return '#fc8181';
      case 'medium': return '#f6ad55';
      case 'low': return '#68d391';
      default: return '#e2e8f0';
    }
  };

  const calculateTotalTime = () => {
    return task.timeSessions.reduce((total, session) => {
      return total + (session.duration || (session.endTime - session.startTime));
    }, 0);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(index);
    
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver(index);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    onDrop(fromIndex, index);
  };

  const handleDragEnd = () => {
    if (itemRef.current) {
      itemRef.current.classList.remove('dragging');
    }
    onDragEnd();
  };

  const isTimerActive = activeTimer === task.id;
  const isOtherTimerActive = activeTimer !== null && activeTimer !== task.id;

  return (
    <div
      ref={itemRef}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className="todo-item"
      style={{
        background: `linear-gradient(135deg, ${getPriorityColor()}20 0%, #ffffff 100%)`,
        borderLeft: `5px solid ${getPriorityColor()}`,
      }}
    >
      <div className="task-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          className="task-checkbox"
        />
        
        <div className="task-name-container">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => {
                if (e.target.value.length <= 50) {
                  setEditName(e.target.value);
                }
              }}
              onBlur={handleSave}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
              className="task-edit-input"
              maxLength={50}
            />
          ) : (
            <span
              className={`task-name ${task.completed ? 'completed' : ''}`}
              onDoubleClick={() => setIsEditing(true)}
              title="Double click to edit"
            >
              {task.name}
            </span>
          )}
          <div className="char-count">
            {isEditing ? `${editName.length}/50` : `${task.name.length}/50`}
          </div>
        </div>
      </div>
      
      <div className="task-meta">
        <div className="time-display">
          <span className="time-icon">⏳</span>
          Total: {formatTime(calculateTotalTime())}
        </div>
        <div className="session-count">
          <span className="session-icon">🔄</span>
          Sessions: {task.timeSessions.length}
        </div>
      </div>
      
      <div className="task-actions">
        <select
          value={task.priority}
          onChange={(e) => handlePriorityChange(e.target.value)}
          className="priority-select"
          style={{ backgroundColor: `${getPriorityColor()}20` }}
          disabled={isOtherTimerActive}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        
        <button 
          onClick={() => setShowCountdown(!showCountdown)}
          className="timer-toggle-btn"
          disabled={isOtherTimerActive}
          title={isOtherTimerActive ? "Another timer is active" : "Set countdown timer"}
        >
          ⏱️
        </button>
        
        <button 
          onClick={() => onDeleteTask(task.id)} 
          className="delete-btn"
          disabled={isOtherTimerActive}
          title={isOtherTimerActive ? "Another timer is active" : "Delete task"}
        >
          🗑️
        </button>
      </div>
      
      <div className="task-timers">
        <Timer 
          onSessionComplete={handleTimeSession}
          isActive={!task.completed && !isOtherTimerActive}
          isRunning={isTimerActive}
          onStart={() => setActiveTimer(task.id)}
          onStop={() => setActiveTimer(null)}
        />
        
        {showCountdown && (
          <div className="countdown-container">
            <div className="countdown-header">
              <span>Set Countdown Timer</span>
              <button 
                onClick={() => {
                  setShowCountdown(false);
                  setActiveTimer(null);
                }}
                className="close-countdown"
              >
                ×
              </button>
            </div>
            <div className="duration-selector">
              <label>Duration (minutes):</label>
              <input
                type="number"
                min="1"
                max="120"
                value={countdownDuration}
                onChange={(e) => {
                  const newDuration = parseInt(e.target.value) || 1;
                  setCountdownDuration(newDuration);
                }}
                className="duration-input"
                disabled={isOtherTimerActive}
              />
            </div>
            <CountdownTimer 
              duration={countdownDuration}
              onComplete={handleCountdownComplete}
              onStart={handleCountdownStart}
              onStop={handleCountdownStop}
              taskId={task.id}
              isActive={!isOtherTimerActive}
              isRunning={isTimerActive}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;