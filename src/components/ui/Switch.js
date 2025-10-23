// src/components/ui/Switch.js
import React from "react";

export const Switch = ({ id, checked, onCheckedChange, className }) => {
  return (
    <label className={`inline-flex relative items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`w-14 h-8 bg-gray-300 rounded-full shadow-inner transition-all ${
          checked ? "bg-primary" : ""
        }`}
      >
        <div
          className={`dot absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
            checked ? "translate-x-6" : ""
          }`}
        />
      </div>
    </label>
  );
};
