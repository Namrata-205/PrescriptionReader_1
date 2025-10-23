import React from "react";
import '../../styles/theme.css';


const Input = ({ type = "text", value, onChange, placeholder, className, id, ...props }) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border-2 border-primary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-lg ${className}`}
      {...props}
    />
  );
};

export { Input };
