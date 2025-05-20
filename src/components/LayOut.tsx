import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-secondary-light/30 flex flex-col">
            {/* Navbar at the top */}
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

            {/* Layout container */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                {/* Main Content Area */}
                <main className="flex-1 py-4 px-4 md:px-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
