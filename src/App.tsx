import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import DashboardLayout from './components/DashboardLayout';
import GroupDiscussionPage from './pages/GroupDiscussionPage';
import GroupsPage from './pages/GroupsPage';
import ResourcesPage from './pages/ResourcesPage';
import ConsultationsPage from './pages/ConsultationsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import SettingsPage from './pages/SettingsPage';
import { useAuth } from './context/AuthContext';
import PatientDashboard from './components/dashboards/PatientDashboard';
import DoctorDashboard from './components/dashboards/DoctorDashboard';
import Layout from './components/LayOut';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
};

// Admin route wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated || userRole !== 'admin') {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

function App() {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <HomePage />} />
        <Route path="/signin" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignInPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUpPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={
            userRole === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />
          } />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="groups/:groupId" element={<GroupDiscussionPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="consultations" element={<ConsultationsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;