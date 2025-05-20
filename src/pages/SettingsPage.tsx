import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            signOut();
            toast.success('Account deleted successfully');
            navigate('/');
        } catch (error) {
            toast.error('Failed to delete account. Please try again.');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="py-4">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            </div>

            <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                    <div className="border-b border-gray-200 pb-6">
                        <h2 className="text-lg font-medium text-gray-900">Account Settings</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    <div className="mt-6">
                        <div className="bg-red-50 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Delete Account
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>
                                            Once you delete your account, there is no going back. Please be certain.
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteModal(true)}
                                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Delete Account
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete your account? This action cannot be undone.
                                All of your data will be permanently removed.
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;