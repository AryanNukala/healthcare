import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MessageCircle, Search, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Group {
  _id: string;
  name: string;
  description: string;
  category: string;
  members: Array<{
    user: {
      _id: string;
      name: string;
    };
  }>;
  isJoined?: boolean;
  joinRequestStatus?: string;
}

const GroupsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [joinReason, setJoinReason] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/groups', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch groups');
      }

      const data = await response.json();
      setGroups(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      setError(error.message);
      toast.error(error.message || 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    if (!selectedGroup) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/groups/${selectedGroup._id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: joinReason })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit join request');
      }

      toast.success('Join request submitted successfully');
      setShowJoinModal(false);
      setJoinReason('');
      setSelectedGroup(null);
      fetchGroups();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit join request');
    }
  };

  const handleGroupClick = (group: Group) => {
    if (group.isJoined) {
      navigate(`/dashboard/groups/${group._id}`);
    } else if (!group.joinRequestStatus) {
      setSelectedGroup(group);
      setShowJoinModal(true);
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading groups</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchGroups}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="sm:flex sm:items-center sm:justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Support Groups</h1>
        <div className="mt-4 sm:mt-0 sm:flex sm:items-center sm:space-x-4">
          <div className="relative rounded-md shadow-sm max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search groups..."
            />
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Group
            </button>
          )}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No groups available</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <div
              key={group._id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleGroupClick(group)}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-500">{group.members.length} members</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">{group.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {group.category}
                  </span>
                  {!group.isJoined && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!group.joinRequestStatus) {
                          setSelectedGroup(group);
                          setShowJoinModal(true);
                        }
                      }}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${group.joinRequestStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : group.joinRequestStatus === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      disabled={!!group.joinRequestStatus}
                    >
                      {group.joinRequestStatus === 'pending'
                        ? 'Request Pending'
                        : group.joinRequestStatus === 'rejected'
                          ? 'Request Rejected'
                          : 'Join Group'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinModal && selectedGroup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Join {selectedGroup.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Why would you like to join this group?
                </label>
                <textarea
                  value={joinReason}
                  onChange={(e) => setJoinReason(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Please share your reason for joining..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setSelectedGroup(null);
                  setJoinReason('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinRequest}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                disabled={!joinReason.trim()}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;