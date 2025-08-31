import React, { useState } from 'react';

const DurationInput = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const numValue = inputValue === '' ? '' : parseInt(inputValue);
    setLocalValue(numValue);
  };

  const handleBlur = () => {
    if (localValue !== '') {
      const validatedValue = Math.min(Math.max(1, localValue), 120);
      onChange(validatedValue);
      setLocalValue(validatedValue);
    } else {
      onChange(25);
      setLocalValue(25);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <input
      type="number"
      min="1"
      max="120"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyPress={handleKeyPress}
    />
  );
};

export default React.memo(DurationInput);