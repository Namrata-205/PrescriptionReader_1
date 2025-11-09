// src/components/ui/RadioGroup.js
import React from "react";

// Updated RadioGroup to accept and pass the 'name' attribute
export const RadioGroup = ({ value, onValueChange, children, name }) => {
  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          onChange: (e) => onValueChange(e.target.value),
          checked: child.props.value === value,
          name: name, // PASS THE NAME PROP HERE
        })
      )}
    </div>
  );
};

// Updated RadioGroupItem to accept and use the 'name' attribute
export const RadioGroupItem = ({ id, value, checked, onChange, className, name }) => {
  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={checked}
      onChange={onChange}
      className={className}
      name={name} // USE THE NAME PROP HERE
    />
  );
};