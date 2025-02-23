import React from 'react';
import { Activity, Users, MessageCircle, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { icon: Activity, label: 'Upcoming Appointments', value: '3' },
    { icon: Users, label: 'Active Support Groups', value: '8' },
    { icon: MessageCircle, label: 'Unread Messages', value: '12' },
    { icon: Calendar, label: 'Upcoming Webinars', value: '4' },
  ];

  return (
    <div className="mt-16">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.label}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {item.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;