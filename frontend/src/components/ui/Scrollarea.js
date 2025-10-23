import React from "react";

export const ScrollArea = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={`overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-muted ${className}`}
    >
      {children}
    </div>
  );
});
