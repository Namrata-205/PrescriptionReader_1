// src/components/ui/Slider.js
import React from "react";

export const Slider = ({ value, onValueChange, min = 0, max = 100, step = 1, className }) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onValueChange([parseFloat(e.target.value)])}
      className={`w-full ${className}`}
    />
  );
};
