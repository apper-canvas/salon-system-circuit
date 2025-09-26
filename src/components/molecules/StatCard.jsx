import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  className 
}) => {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-3xl font-bold text-primary-800 mt-2 font-display">{value}</p>
          {trend && trendValue && (
            <div className={cn(
              "flex items-center mt-2 text-sm",
              trend === "up" ? "text-green-600" : "text-red-600"
            )}>
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                className="h-4 w-4 mr-1" 
              />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="ml-4">
          <div className="bg-gradient-to-br from-primary-100 to-secondary-100 p-3 rounded-lg">
            <ApperIcon name={icon} className="h-6 w-6 text-primary-600" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;