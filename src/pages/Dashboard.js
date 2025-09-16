import { useState, useEffect } from 'react';
import TodoList from '../components/TodoList';
import Calendar from '../components/Calendar';
import { getTasks, addTask, updateTask, deleteTask, saveTasks } from '../utils/storage';
import { jwtDecode } from 'jwt-decode';
import { addTaskApi } from '../api/taskApi';

const baseUrl = process.env.REACT_APP_BASE_URL;
const addTaskEndpoint = `http://${baseUrl}:15000/api/v1/task/add`;


const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [activeView, setActiveView] = useState('list');
  const [newTaskName, setNewTaskName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user && user.accessToken) {
      try {
        const decodedToken = jwtDecode(user.accessToken);
        setUserName(decodedToken.fullName);
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserName('Guest'); // Fallback
      }
    } else {
      setUserName('Guest'); // Fallback if no user or accessToken
    }
    const userTasks = getTasks(user.id);
    setTasks(userTasks);
  }, [user]);

const handleAddTask = async () => {
  // Do nothing if input is empty
  if (!newTaskName.trim()) return;

  setIsAdding(true);

  // Prepare task payload for backend
  const newTask = {
    name: newTaskName,
    description: '',
    priority: 'Medium', // match backend enum
    addedDate: new Date().toISOString().split('T')[0], // yyyy-MM-dd for LocalDate
    isCompleted: false,
  };

  try {
    // Call backend API; pass accessToken if available
    const savedTask = await addTaskApi(newTask, user?.accessToken || null);

    // Update state with the saved task returned from backend
    setTasks(prevTasks => [...prevTasks, savedTask]);
    setNewTaskName('');
  } catch (error) {
    console.error('Failed to add task:', error);
  } finally {
    setIsAdding(false);
  }
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
    setTasks(reorderedTasks);
    saveTasks(user.id, reorderedTasks);
  };

  return (
      <div className="dashboard">
          <header className="dashboard-header">
              <h1>Welcome, {userName}!</h1>
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