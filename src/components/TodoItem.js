import React, { useState } from 'react';
import Timer from './Timer';
import CountdownTimer from './CountdownTimer';

const TodoItem = ({ task, index, onUpdateTask, onDeleteTask, onDragStart, onDragOver, onDrop, onDragEnd }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownDuration, setCountdownDuration] = useState(25); // Default 25 minutes

  const handleSave = () => {
    if (editName.trim()) {
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
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffd166';
      case 'low': return '#06d6a0';
      default: return '#e0e0e0';
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
    onDragEnd();
  };

  return (
    <div
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
        <div className="task-handle">
          <span>☰</span>
        </div>
        
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          className="task-checkbox"
        />
        
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSave}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
            className="task-edit-input"
          />
        ) : (
          <span
            className={`task-name ${task.completed ? 'completed' : ''}`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {task.name}
          </span>
        )}
        
        <div className="task-actions">
          <select
            value={task.priority}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="priority-select"
            style={{ backgroundColor: `${getPriorityColor()}40` }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          
          <button 
            onClick={() => setShowCountdown(!showCountdown)}
            className="timer-toggle-btn"
          >
            ⏱️
          </button>
          
          <button 
            onClick={() => setIsEditing(true)} 
            className="edit-btn"
          >
            ✏️
          </button>
          
          <button 
            onClick={() => onDeleteTask(task.id)} 
            className="delete-btn"
          >
            🗑️
          </button>
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
      
      <div className="task-timers">
        <Timer 
          onSessionComplete={handleTimeSession}
          isActive={!task.completed}
        />
        
        {showCountdown && (
          <div className="countdown-container">
            <div className="countdown-header">
              <span>Set Countdown Timer</span>
              <button 
                onClick={() => setShowCountdown(false)}
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
                onChange={(e) => setCountdownDuration(parseInt(e.target.value) || 25)}
              />
            </div>
            <CountdownTimer 
              duration={countdownDuration}
              onComplete={handleCountdownComplete}
              taskId={task.id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;