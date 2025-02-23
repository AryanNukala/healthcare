import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Home, Users, FileText, Video, Calendar, Settings, BookOpen } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Support Groups', path: '/dashboard/groups' },
    { icon: BookOpen, label: 'Resources', path: '/dashboard/resources' },
    { icon: Video, label: 'Consultations', path: '/dashboard/consultations' },
    { icon: Calendar, label: 'My Appointments', path: '/dashboard/appointments' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 z-30 transition duration-200 ease-in-out`}
    >
      <div className="flex flex-col h-full w-64 bg-indigo-700">
        <div className="flex items-center justify-between h-16 px-4 bg-indigo-800 md:hidden">
          <span className="text-xl font-bold text-white">Menu</span>
          <button
            onClick={onClose}
            className="text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-indigo-800 text-white'
                    : 'text-white hover:bg-indigo-600'
                } transition-colors duration-150`}
              >
                <item.icon className="mr-3 h-6 w-6" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;