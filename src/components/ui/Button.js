import React from "react";
import '../../styles/theme.css';

const Button = ({
  children,
  variant = "default",
  size = "md",
  onClick,
  className,
  type = "button",
  ...props
}) => {
  let base =
    "rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform duration-300 ease-in-out";
  let variantClass = "";
  let sizeClass = "";

  // Variants
  switch (variant) {
    case "outline":
      variantClass =
        "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white";
      break;
    case "ghost":
      variantClass = "bg-transparent text-primary hover:bg-primary/10";
      break;
    case "medical":
      variantClass = "bg-primary text-white hover:bg-primary-dark";
      break;
    default:
      variantClass = "bg-primary text-white hover:bg-primary-dark";
  }

  // Sizes
  switch (size) {
    case "sm":
      sizeClass = "px-3 py-1 text-sm";
      break;
    case "lg":
      sizeClass = "px-6 py-3 text-lg";
      break;
    case "icon":
      sizeClass =
        "p-2 w-10 h-10 flex items-center justify-center hover:scale-110";
      break;
    default:
      sizeClass = "px-4 py-2";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variantClass} ${sizeClass} ${className} hover:scale-105`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
