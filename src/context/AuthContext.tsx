import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  adminSignIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    // Implement actual authentication logic here
    setIsAuthenticated(true);
    setUserRole('user');
  };

  const signUp = async (data: any) => {
    // Implement actual sign up logic here
    setIsAuthenticated(true);
    setUserRole('user');
  };

  const adminSignIn = async (email: string, password: string) => {
    // Implement actual admin authentication logic here
    setIsAuthenticated(true);
    setUserRole('admin');
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, signIn, signUp, adminSignIn, signOut }}
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