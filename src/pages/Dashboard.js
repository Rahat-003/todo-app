import React, { useState, useEffect } from 'react';
import TodoList from '../components/TodoList';
import Calendar from '../components/Calendar';
import { getTasks, addTask, updateTask, deleteTask, saveTasks } from '../utils/storage';

const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [activeView, setActiveView] = useState('list');
  const [newTaskName, setNewTaskName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const userTasks = getTasks(user.id);
    setTasks(userTasks);
  }, [user.id]);

  const handleAddTask = () => {
      if (!newTaskName.trim()) return;

      setIsAdding(true);

      setTimeout(() => {
          const newTask = {
              id: Date.now().toString(),
              name: newTaskName,
              completed: false,
              priority: "medium",
              timeSessions: [],
              createdAt: new Date().toISOString(),
          };

          const updatedTasks = addTask(user.id, newTask);
          setTasks(updatedTasks);
          setNewTaskName("");
          setIsAdding(false);
      }, 300);
  };

  const handleUpdateTask = (taskId, updates) => {
    const updatedTasks = updateTask(user.id, taskId, updates);
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = deleteTask(user.id, taskId);
    setTasks(updatedTasks);
  };

  const handleReorderTasks = (reorderedTasks) => {
      // Update both state and storage
      setTasks(reorderedTasks);
      saveTasks(user.id, reorderedTasks);
  };

  return (
      <div className="dashboard">
          <header className="dashboard-header">
              <h1>Welcome, {user.name}!</h1>
              <button onClick={onLogout} className="logout-btn">
                  Logout
              </button>
          </header>

          <div className="view-toggles">
              <button
                  className={activeView === "list" ? "active" : ""}
                  onClick={() => setActiveView("list")}
              >
                  Task List
              </button>
              <button
                  className={activeView === "calendar" ? "active" : ""}
                  onClick={() => setActiveView("calendar")}
              >
                  Calendar
              </button>
          </div>

          {activeView === "list" && (
              <div className="todo-view">
                  <div className="add-task">
                      <input
                          type="text"
                          value={newTaskName}
                          onChange={(e) => setNewTaskName(e.target.value)}
                          placeholder="Enter new task..."
                          onKeyPress={(e) =>
                              e.key === "Enter" && handleAddTask()
                          }
                      />
                      <button
                          onClick={handleAddTask}
                          className={isAdding ? "animate" : ""}
                      >
                          Add Task
                      </button>
                  </div>

                  <TodoList
                      tasks={tasks}
                      onUpdateTask={handleUpdateTask}
                      onDeleteTask={handleDeleteTask}
                      onReorderTasks={handleReorderTasks}
                  />
              </div>
          )}

          {activeView === "calendar" && <Calendar tasks={tasks} />}
      </div>
  );
};

export default Dashboard;