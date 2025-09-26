import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  icon = "Calendar",
  title = "No items found", 
  message = "Get started by creating your first item.",
  actionLabel = "Create New",
  onAction,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
      <div className="bg-gradient-to-br from-primary-100 to-secondary-100 p-6 rounded-full mb-6">
        <ApperIcon name={icon} className="h-12 w-12 text-primary-600" />
      </div>
      <h3 className="text-xl font-semibold text-primary-800 mb-2 font-display text-center">
        {title}
      </h3>
      <p className="text-secondary-600 text-center mb-6 max-w-md">
        {message}
      </p>
      {onAction && (
        <Button onClick={onAction} variant="accent">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;