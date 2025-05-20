import React, { useState } from 'react';
import { Users, MessageCircle, Plus } from 'lucide-react';

const SupportGroups: React.FC = () => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const groups = [
    {
      name: 'Diabetes Care',
      members: 1240,
      activity: 'High',
      color: 'bg-blue-100 text-blue-800',
      description: 'Support and discussion for managing diabetes effectively.',
      recentTopics: ['Blood Sugar Management', 'Diet Tips', 'Exercise Routines']
    },
    {
      name: 'Mental Health Support',
      members: 890,
      activity: 'Very High',
      color: 'bg-green-100 text-green-800',
      description: 'A safe space for mental health discussions and support.',
      recentTopics: ['Anxiety Management', 'Depression Support', 'Mindfulness']
    },
    {
      name: 'Heart Health',
      members: 650,
      activity: 'Medium',
      color: 'bg-yellow-100 text-yellow-800',
      description: 'Discussion forum for heart health and cardiovascular care.',
      recentTopics: ['Blood Pressure', 'Heart-Healthy Diet', 'Exercise Tips']
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Support Groups</h2>
          <button
            onClick={() => setShowJoinModal(true)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Join New
          </button>
        </div>

        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.name} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-2 rounded-lg bg-indigo-50">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{group.name}</p>
                  <p className="text-sm text-gray-500">{group.members} members</p>
                  <p className="text-xs text-gray-500 mt-1">{group.description}</p>
                </div>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${group.color}`}>
                  {group.activity}
                </div>
              </div>

              <div className="mt-3 border-t pt-3">
                <div className="flex items-center text-sm text-gray-500">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Recent Topics:
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.recentTopics.map((topic) => (
                    <span key={topic} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Group Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Join Support Group</h3>
            <div className="space-y-4">
              {groups.map((group) => (
                <button
                  key={group.name}
                  onClick={() => setSelectedGroup(group.name)}
                  className={`w-full text-left p-4 rounded-lg border ${selectedGroup === group.name ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
                    }`}
                >
                  <p className="font-medium">{group.name}</p>
                  <p className="text-sm text-gray-500">{group.description}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle join group logic here
                  setShowJoinModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                disabled={!selectedGroup}
              >
                Join Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportGroups;