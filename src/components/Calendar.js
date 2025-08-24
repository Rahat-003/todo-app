import React, { useState } from 'react';
import TaskModal from './TaskModal';

const Calendar = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayTasks = getTasksForDate(date);
      const hasTasks = dayTasks.length > 0;
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${hasTasks ? 'has-tasks' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          <div className="day-number">{day}</div>
          <div className="day-tasks">
            {dayTasks.slice(0, 3).map(task => (
              <div 
                key={task.id} 
                className="task-indicator"
                style={{ 
                  backgroundColor: task.completed ? '#06d6a0' : 
                    task.priority === 'high' ? '#ff6b6b' : 
                    task.priority === 'medium' ? '#ffd166' : '#118ab2'
                }}
                title={task.name}
              ></div>
            ))}
            {dayTasks.length > 3 && (
              <div className="more-tasks">+{dayTasks.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={() => navigateMonth(-1)} className="nav-btn">&lt;</button>
          <h2>{monthYear}</h2>
          <button onClick={() => navigateMonth(1)} className="nav-btn">&gt;</button>
        </div>
        
        <div className="calendar-weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        
        <div className="calendar-days">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-view">
      <h2>Task Calendar</h2>
      {renderCalendar()}
      
      {showModal && selectedDate && (
        <TaskModal 
          date={selectedDate} 
          tasks={getTasksForDate(selectedDate)} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default Calendar;