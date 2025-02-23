import React from 'react';
import { Users, MessageCircle } from 'lucide-react';

const GroupsPage = () => {
  const groups = [
    {
      id: 1,
      name: 'Diabetes Support Network',
      members: 1240,
      description: 'A supportive community for managing diabetes and sharing experiences.',
      topics: ['Blood Sugar Management', 'Diet Tips', 'Exercise Routines'],
      lastActive: '5 minutes ago'
    },
    {
      id: 2,
      name: 'Heart Health Warriors',
      members: 890,
      description: 'Connect with others focused on cardiovascular health and wellness.',
      topics: ['Blood Pressure', 'Heart-Healthy Diet', 'Exercise Tips'],
      lastActive: '10 minutes ago'
    },
    {
      id: 3,
      name: 'Mental Wellness Circle',
      members: 1560,
      description: 'Safe space for discussing mental health and sharing coping strategies.',
      topics: ['Anxiety Support', 'Depression', 'Mindfulness'],
      lastActive: '2 minutes ago'
    },
    {
      id: 4,
      name: 'Cancer Support Community',
      members: 750,
      description: 'Supporting each other through cancer treatment and recovery.',
      topics: ['Treatment Support', 'Survivor Stories', 'Wellness Tips'],
      lastActive: '1 hour ago'
    }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Support Groups</h1>
        <button className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          Create New Group
        </button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.members} members</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600">{group.description}</p>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Active Topics:
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.topics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Last active {group.lastActive}
                </span>
                <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                  Join Group
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsPage;