import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  profile?: {
    specialization?: string;
    licenseNumber?: string;
    isApproved?: boolean;
    assignedGroups?: string[];
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth state on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      setUserRole(storedRole);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userRole', data.user.role);

      // Update state synchronously
      setUser(data.user);
      setUserRole(data.user.role);
      setIsAuthenticated(true);

      let roleMessage = 'Successfully signed in!';
      if (data.user.role === 'doctor' && !data.user.profile?.isApproved) {
        roleMessage = 'Signed in successfully. Please wait for admin approval to access all features.';
      }

      toast.success(roleMessage);
    } catch (error) {
      if (!navigator.onLine) {
        throw new Error('Network error: Please check your connection');
      }
      throw error;
    }
  };

  const signUp = async (data: any) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to sign up');
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('userRole', result.user.role);

      // Update state synchronously
      setUser(result.user);
      setUserRole(result.user.role);
      setIsAuthenticated(true);

      const roleMessage = result.user.role === 'doctor'
        ? 'Account created successfully. Please wait for admin approval to access all features.'
        : 'Successfully signed up!';

      toast.success(roleMessage);
    } catch (error) {
      if (!navigator.onLine) {
        throw new Error('Network error: Please check your connection');
      }
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    toast.success('Successfully signed out!');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, userRole, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};