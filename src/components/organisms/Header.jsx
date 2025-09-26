import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  const currentDate = new Date();

  return (
    <header className="bg-gradient-to-r from-white to-secondary-50 shadow-salon border-b border-secondary-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <Button variant="ghost" size="sm" onClick={onMenuClick}>
              <ApperIcon name="Menu" className="h-5 w-5" />
            </Button>
          </div>

          {/* Title and date */}
          <div className="flex-1 lg:ml-0 ml-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-800 font-display">{title}</h1>
              <div className="hidden sm:block ml-4 pl-4 border-l border-secondary-200">
                <p className="text-sm text-secondary-600">
                  {format(currentDate, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center space-x-3">
            <Button variant="accent" size="sm" className="hidden sm:flex">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
            
            <Button variant="ghost" size="sm">
              <ApperIcon name="Bell" className="h-5 w-5" />
            </Button>
            
            <div className="hidden sm:flex items-center ml-4 pl-4 border-l border-secondary-200">
              <div className="bg-gradient-to-br from-primary-600 to-accent-500 p-2 rounded-full">
                <ApperIcon name="User" className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;