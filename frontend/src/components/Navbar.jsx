import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ttLogo from '@/assets/tt-logo.svg';
import { Home as HomeIcon, LogIn, LogOut, FileText, PlusSquare } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem('authToken'));

  const links = [
    { to: isAuthenticated ? '/home' : '/', label: 'Home', icon: <HomeIcon size={20} /> },
    ...(isAuthenticated
      ? [
          { to: '/add',   label: 'Add Exam', icon: <PlusSquare size={20} /> },
          { to: '/exams', label: 'Exams', icon: <FileText size={20} />   },
        ]
      : []),
  ];

  return (
    <nav className="bg-black bg-opacity-90 backdrop-blur-md py-4">
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo + Title */}
        <Link to="/" className="flex items-center">
          <img src={ttLogo} alt="Texas Tech University Logo" className="h-8 w-auto mr-3" />
          <span className="text-white text-xl font-bold">Exam Scheduler</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`group flex items-center space-x-1 p-1 text-white/80 hover:text-white transition ease-in-out duration-200 ${
                location.pathname === to ? 'underline text-white' : ''
              }`}
            >
              {icon ? (
                <span className="text-white">
                  {icon}
                </span>
              ) : null}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium">
                {label}
              </span>
            </Link>
          ))}

          {/* Login or Logout */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="group flex items-center space-x-1 p-1 text-red-600 hover:text-red-500 transition ease-in-out duration-200"
            >
              <LogIn size={20} />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium">
                Login
              </span>
            </Link>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem('authToken');
                window.location.reload();
              }}
              className="group flex items-center space-x-1 p-1 text-red-600 hover:text-red-500 transition ease-in-out duration-200"
            >
              <LogOut size={20} />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium">
                Logout
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}



