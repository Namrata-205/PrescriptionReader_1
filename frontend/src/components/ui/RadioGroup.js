// src/components/ui/RadioGroup.js
import React from "react";

export const RadioGroup = ({ value, onValueChange, children }) => {
  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          onChange: (e) => onValueChange(e.target.value),
          checked: child.props.value === value,
        })
      )}
    </div>
  );
};

export const RadioGroupItem = ({ id, value, checked, onChange, className }) => {
  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={checked}
      onChange={onChange}
      className={className}
    />
  );
};
