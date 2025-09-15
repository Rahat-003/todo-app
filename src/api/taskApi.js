const baseUrl = process.env.REACT_APP_BASE_URL;
const port = process.env.REACT_APP_BASE_PORT;

/**
 * Fetch all tasks for a user
 * @param {string} accessToken
 * @returns {Promise<Array>}
 */
export const getTasksApi = async (accessToken) => {
  try {
    const response = await fetch(`http://${baseUrl}:${port}/api/v1/task`, {
      headers: accessToken
        ? { 'Authorization': `Bearer ${accessToken}` }
        : {},
    });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
  } catch (error) {
    console.error('getTasksApi error:', error);
    return [];
  }
};

/**
 * Add a new task
 */
export const addTaskApi = async (task, accessToken) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    const response = await fetch(`http://${baseUrl}:${port}/api/v1/task/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify(task),
    });
    console.log("addTask console");
    if (!response.ok) throw new Error('Failed to add task');
    return await response.json();
  } catch (error) {
    console.error('addTaskApi error:', error);
    throw error;
  }
};

/**
 * Update a task
 */
export const updateTaskApi = async (taskId, updates, accessToken) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    const response = await fetch(`http://${baseUrl}:${port}/api/v1/task/${taskId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return await response.json();
  } catch (error) {
    console.error('updateTaskApi error:', error);
    throw error;
  }
};

/**
 * Delete a task
 */
export const deleteTaskApi = async (taskId, accessToken) => {
  try {
    const headers = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    const response = await fetch(`http://${baseUrl}:${port}/api/v1/task/${taskId}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return true;
  } catch (error) {
    console.error('deleteTaskApi error:', error);
    return false;
  }
};
