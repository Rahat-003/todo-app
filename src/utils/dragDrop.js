// HTML5 Drag and Drop utilities
export const reorderTasks = (list, startIndex, endIndex) => {
    // Make sure we're working with a copy of the array
    const result = Array.from(list);

    // Remove the item from its original position
    const [removed] = result.splice(startIndex, 1);

    // Insert it at the new position
    result.splice(endIndex, 0, removed);

    return result;
};

// Get task element with drag handle
export const getItemStyle = (isDragging, priority) => {
  const priorityColors = {
      high: "#fc8181",
      medium: "#f6ad55",
      low: "#68d391",
  };
  
  return {
      userSelect: "none",
      padding: "16px",
      margin: "0 0 8px 0",
      borderRadius: "6px",
      background: isDragging
          ? "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
          : `linear-gradient(135deg, ${priorityColors[priority]}20 0%, #ffffff 100%)`,
      borderLeft: `5px solid ${priorityColors[priority]}`,
      boxShadow: isDragging
          ? "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
          : "0 2px 5px rgba(0,0,0,0.1)",
      transform: isDragging ? "rotate(3deg)" : "none",
      transition: "all 0.3s ease",
      cursor: "grab",
  };
};

export const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)' : 'transparent',
  padding: '8px',
  borderRadius: '6px',
  transition: 'background 0.3s ease',
  width: '100%',
  minHeight: '100px'
});