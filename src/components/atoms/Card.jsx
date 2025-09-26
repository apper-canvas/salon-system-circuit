import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "bg-surface rounded-lg shadow-salon border border-secondary-100",
        "transition-all duration-200 hover:shadow-salon-lg",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;