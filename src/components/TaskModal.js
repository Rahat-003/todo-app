import React from 'react';

const TaskModal = ({ date, tasks, onClose }) => {
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const calculateTotalTime = (task) => {
    return task.timeSessions.reduce((total, session) => {
      return total + (session.duration || (session.endTime - session.startTime));
    }, 0);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffd166';
      case 'low': return '#06d6a0';
      default: return '#e0e0e0';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="task-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Tasks for {date.toLocaleDateString()}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="modal-content">
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks for this date</p>
          ) : (
            <div className="task-list">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  className="task-item"
                  style={{ borderLeft: `4px solid ${getPriorityColor(task.priority)}` }}
                >
                  <div className="task-title">
                    <span className={task.completed ? 'completed' : ''}>{task.name}</span>
                    <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                  </div>
                  
                  <div className="task-details">
                    <div className="time-spent">
                      <span className="time-icon">⏱️</span>
                      {formatTime(calculateTotalTime(task))}
                    </div>
                    <div className="session-count">
                      <span className="session-icon">🔄</span>
                      {task.timeSessions.length} sessions
                    </div>
                  </div>
                  
                  {task.timeSessions.length > 0 && (
                    <div className="session-list">
                      <h4>Work Sessions:</h4>
                      {task.timeSessions.map((session, index) => (
                        <div key={index} className="session-item">
                          <span>
                            {new Date(session.startTime).toLocaleTimeString()} - 
                            {new Date(session.endTime).toLocaleTimeString()}
                          </span>
                          <span>
                            {formatTime(session.duration || (session.endTime - session.startTime))}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;