import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const navigationItems = [
    { to: "/", icon: "LayoutDashboard", label: "Dashboard", end: true },
    { to: "/calendar", icon: "Calendar", label: "Calendar" },
    { to: "/clients", icon: "Users", label: "Clients" },
    { to: "/services", icon: "Scissors", label: "Services" },
    { to: "/staff", icon: "UserCheck", label: "Staff" },
    { to: "/reports", icon: "BarChart3", label: "Reports" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-primary-50 to-secondary-50 border-r border-secondary-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="bg-gradient-to-br from-primary-600 to-accent-500 p-3 rounded-xl">
              <ApperIcon name="Scissors" className="h-8 w-8 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-primary-800 font-display">Salon Hub</h1>
              <p className="text-sm text-secondary-600">Beauty Management</p>
            </div>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-salon"
                      : "text-primary-700 hover:bg-primary-100 hover:text-primary-800"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon 
                      name={item.icon} 
                      className={cn(
                        "mr-3 h-5 w-5 transition-colors duration-200",
                        isActive ? "text-white" : "text-primary-600"
                      )} 
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-40 transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className="absolute inset-0 bg-primary-900/50 backdrop-blur-sm" onClick={onClose} />
        
        <div className={cn(
          "relative flex flex-col w-64 h-full bg-gradient-to-b from-primary-50 to-secondary-50 shadow-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between flex-shrink-0 px-4 pt-5 pb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-primary-600 to-accent-500 p-3 rounded-xl">
                <ApperIcon name="Scissors" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-primary-800 font-display">Salon Hub</h1>
                <p className="text-xs text-secondary-600">Beauty Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-primary-600 hover:bg-primary-100 transition-colors duration-200"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="mt-5 flex-1 px-2 space-y-1 pb-4">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-salon"
                      : "text-primary-700 hover:bg-primary-100 hover:text-primary-800"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon 
                      name={item.icon} 
                      className={cn(
                        "mr-3 h-5 w-5 transition-colors duration-200",
                        isActive ? "text-white" : "text-primary-600"
                      )} 
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;