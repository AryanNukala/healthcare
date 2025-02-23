import React from 'react';
import { Calendar } from 'lucide-react';

const UpcomingWebinars: React.FC = () => {
  const webinars = [
    {
      title: 'Understanding Anxiety Management',
      doctor: 'Dr. Emily Brooks',
      date: 'Mar 15, 2024',
      time: '2:00 PM EST',
    },
    {
      title: 'Heart Health Essentials',
      doctor: 'Dr. Sarah Wilson',
      date: 'Mar 18, 2024',
      time: '3:30 PM EST',
    },
    {
      title: 'Brain Health & Aging',
      doctor: 'Dr. Michael Chen',
      date: 'Mar 20, 2024',
      time: '1:00 PM EST',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Webinars</h2>
        <div className="mt-6 space-y-6">
          {webinars.map((webinar) => (
            <div key={webinar.title} className="relative">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {webinar.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {webinar.doctor} • {webinar.date} • {webinar.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
          View All Webinars
        </button>
      </div>
    </div>
  );
};

export default UpcomingWebinars;