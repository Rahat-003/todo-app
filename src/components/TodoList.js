import React, { useState } from 'react';
import TodoItem from './TodoItem';
import { reorderTasks } from '../utils/dragDrop';

const TodoList = ({ tasks, onUpdateTask, onDeleteTask, onReorderTasks }) => {
  const [draggingIndex, setDraggingIndex] = useState(null);

  const sortedTasks = [...tasks].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const handleDragStart = (index) => {
      setDraggingIndex(index);
  };

  const handleDragOver = (index) => {
      // This is handled in the TodoItem component
  };

  const handleDrop = (fromIndex, toIndex) => {
      if (fromIndex !== toIndex) {
          const reorderedTasks = reorderTasks(sortedTasks, fromIndex, toIndex);
          onReorderTasks(reorderedTasks);
      }
      setDraggingIndex(null);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  return (
    <div className="todo-list">
      {sortedTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No tasks yet. Add a new task to get started!</p>
        </div>
      ) : (
        sortedTasks.map((task, index) => (
          <TodoItem
            key={task.id}
            task={task}
            index={index}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))
      )}
    </div>
  );
};

export default TodoList;