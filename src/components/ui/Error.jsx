import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading your data. Please try again.",
  onRetry,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
      <div className="bg-gradient-to-br from-red-100 to-red-50 p-6 rounded-full mb-6">
        <ApperIcon name="AlertTriangle" className="h-12 w-12 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-primary-800 mb-2 font-display text-center">
        {title}
      </h3>
      <p className="text-secondary-600 text-center mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;