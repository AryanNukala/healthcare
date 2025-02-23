import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import GroupsPage from '../pages/GroupsPage';
import ResourcesPage from '../pages/ResourcesPage';
import ConsultationsPage from '../pages/ConsultationsPage';
import FeaturedDoctors from './FeaturedDoctors';
import SupportGroups from './SupportGroups';
import UpcomingWebinars from './UpcomingWebinars';
import QASection from './QASection';
import ArticleDiscussions from './ArticleDiscussions';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="md:pl-64 pt-16">
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <Dashboard />
                    <QASection />
                    <ArticleDiscussions />
                  </div>
                  <div className="space-y-6">
                    <FeaturedDoctors />
                    <SupportGroups />
                    <UpcomingWebinars />
                  </div>
                </div>
              } />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/consultations" element={<ConsultationsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;