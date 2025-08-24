export const getTasks = (userId) => {
  const tasks = JSON.parse(localStorage.getItem(`tasks_${userId}`) || '[]');
  return tasks;
};

export const saveTasks = (userId, tasks) => {
  localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
};

export const addTask = (userId, task) => {
  const tasks = getTasks(userId);
  tasks.push(task);
  saveTasks(userId, tasks);
  return tasks;
};

export const updateTask = (userId, taskId, updates) => {
  const tasks = getTasks(userId);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    saveTasks(userId, tasks);
  }
  
  return tasks;
};

export const deleteTask = (userId, taskId) => {
  const tasks = getTasks(userId);
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  saveTasks(userId, filteredTasks);
  return filteredTasks;
};