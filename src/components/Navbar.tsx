import React, { useState } from 'react';
import { Bell, Menu, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-secondary-light hover:text-primary transition-colors duration-200"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 flex items-center ml-4 md:ml-0">
              <span className="text-2xl font-bold text-primary">SereneCare</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 rounded-lg text-text-secondary hover:bg-secondary-light hover:text-primary transition-colors duration-200">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-accent-dark ring-2 ring-white" />
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 focus:outline-none"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <div className="relative">
                  <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-secondary-light" />
                </div>
                <div className="hidden md:flex md:items-center">
                  <span className="text-sm font-medium text-text-secondary group-hover:text-text">
                    {user?.name || 'User'}
                  </span>
                </div>
              </button>

              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-glass backdrop-blur-glass bg-white/90 py-1 ring-1 ring-secondary focus:outline-none z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:bg-secondary-light hover:text-primary transition-colors duration-200"
                    role="menuitem"
                    onClick={() => {
                      setShowProfileMenu(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Your Profile
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:bg-secondary-light hover:text-primary transition-colors duration-200"
                    role="menuitem"
                    onClick={() => {
                      setShowProfileMenu(false);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-accent-dark hover:bg-accent/10 transition-colors duration-200"
                    role="menuitem"
                    onClick={() => {
                      handleSignOut();
                      setShowProfileMenu(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;