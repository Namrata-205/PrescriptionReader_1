import React from "react";
import '../../styles/theme.css';


const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border-2 border-primary p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={`mt-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className, ...props }) => {
  return (
    <h2 className={`text-2xl font-bold text-primary ${className}`} {...props}>
      {children}
    </h2>
  );
};

const CardDescription = ({ children, className, ...props }) => {
  return (
    <p className={`text-lg text-muted-foreground ${className}`} {...props}>
      {children}
    </p>
  );
};

export { Card, CardHeader, CardContent, CardTitle, CardDescription };
