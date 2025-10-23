import React from "react";
import '../../styles/theme.css';


const Label = ({ htmlFor, children, className, ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-lg font-semibold text-primary mb-1 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export { Label };
