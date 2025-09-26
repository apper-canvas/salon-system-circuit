import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className }) => {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-secondary-100 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-secondary-200 rounded w-20"></div>
                <div className="h-8 bg-secondary-200 rounded w-16"></div>
                <div className="h-3 bg-secondary-200 rounded w-12"></div>
              </div>
              <div className="ml-4">
                <div className="bg-secondary-200 p-3 rounded-lg">
                  <div className="h-6 w-6 bg-secondary-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <div className="h-6 bg-secondary-200 rounded w-40"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-secondary-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-secondary-200 rounded w-32"></div>
                  <div className="h-3 bg-secondary-200 rounded w-48"></div>
                  <div className="h-3 bg-secondary-200 rounded w-24"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-secondary-200 rounded"></div>
                  <div className="h-8 w-8 bg-secondary-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;