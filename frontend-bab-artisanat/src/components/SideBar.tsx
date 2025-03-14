import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBox, FaList, FaUsers, FaChartBar } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", label: "Home", icon: <FaChartBar /> },
    { path: "/products/list", label: "Products", icon: <FaBox /> },
    { path: "/categories/list", label: "Categories", icon: <FaList /> },
    { path: "/users", label: "Users", icon: <FaUsers /> }
  ];

  return (
    <div 
      className={`${collapsed ? 'w-20' : 'w-72'} h-screen bg-gradient-to-b from-amber-700 to-amber-900 text-white flex flex-col shadow-xl transition-all duration-300 ease-in-out`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-amber-600">
        {!collapsed && (
          <h2 className="text-2xl font-bold text-amber-50 tracking-wide">Dashboard</h2>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-amber-800 transition-colors text-amber-200"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} p-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-amber-800 text-white shadow-md'
                    : 'text-amber-100 hover:bg-amber-800/40 hover:text-white'
                }`}
              >
                <div className={`text-xl ${isActive(item.path) ? 'text-amber-200' : ''}`}>
                  {item.icon}
                </div>
                {!collapsed && (
                  <span className={`ml-3 font-medium ${isActive(item.path) ? 'text-amber-50' : ''}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-amber-600 ${collapsed ? 'text-center' : ''}`}>
        {!collapsed ? (
          <p className="text-xs text-amber-300">Admin Panel v1.0</p>
        ) : (
          <p className="text-xs text-amber-300">v1.0</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;