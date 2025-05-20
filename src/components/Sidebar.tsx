import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Home, Users, FileText, Video, Calendar, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { userRole } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Support Groups', path: '/dashboard/groups' },
    { icon: FileText, label: 'Resources', path: '/dashboard/resources' },
    { icon: Video, label: 'Consultations', path: '/dashboard/consultations' },
    { icon: Calendar, label: 'My Appointments', path: '/dashboard/appointments' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 z-30 transition duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full w-64 bg-white shadow-glass backdrop-blur-glass border-r border-secondary">
        <div className="flex items-center justify-between h-16 px-6 bg-primary md:hidden">
          <span className="text-xl font-bold text-white">Menu</span>
          <button
            onClick={onClose}
            className="text-white hover:bg-primary-dark rounded-full p-2 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center px-6 py-4 border-b border-secondary">
          <span className="text-2xl font-bold text-primary">SereneCare</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-primary text-white shadow-md transform scale-102'
                  : 'text-text-secondary hover:bg-secondary-light hover:text-primary'
                  }`}
                onClick={onClose}
              >
                <item.icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${isActive ? 'text-white' : 'text-primary'
                  }`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-6 border-t border-secondary">
          <div className="flex items-center px-4 py-3 rounded-lg bg-secondary-light">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {userRole?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-secondary">
                {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;