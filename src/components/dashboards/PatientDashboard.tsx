import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Users, MessageCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface Doctor {
    _id: string;
    name: string;
    email: string;
    profile: {
        specialization: string;
    };
}

interface Appointment {
    _id: string;
    doctor: Doctor;
    date: string;
    time: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
}

const PatientDashboard: React.FC = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const stats = [
        {
            name: 'My Appointments',
            value: appointments.length.toString(),
            icon: Calendar,
        },
        {
            name: 'My Groups',
            value: '3',
            icon: Users,
        },
        {
            name: 'My Questions',
            value: '5',
            icon: MessageCircle,
        },
        {
            name: 'Saved Articles',
            value: '8',
            icon: FileText,
        },
    ];

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/appointments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            toast.error('Failed to fetch appointments');
        }
    };

    return (
        <div className="py-4">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Track your health journey and connect with healthcare professionals
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white overflow-hidden shadow rounded-lg"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <stat.icon className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            {stat.name}
                                        </dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900">
                                                {stat.value}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Appointments Section */}
            <div className="mt-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900">My Appointments</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {appointments.map((appointment) => (
                                        <tr key={appointment._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    Dr. {appointment.doctor?.name || 'Unknown'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {appointment.doctor?.profile?.specialization || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(appointment.date).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {appointment.time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : appointment.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {appointment.notes || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;