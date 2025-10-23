import React from "react";
import "../../styles/theme.css"; // make sure your styles are included

const Progress = ({ value = 0, className }) => {
  return (
    <div className={`progress-bar-container ${className || ""}`}>
      <div
        className="progress-bar-fill"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export { Progress };
