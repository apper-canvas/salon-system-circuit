import React from "react";
import { cn } from "@/utils/cn";

const Label = React.forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-primary-700 mb-1",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = "Label";

export default Label;