import React from "react";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      {...props}
      className={`w-full rounded-lg border border-border p-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none ${className}`}
    />
  );
});
