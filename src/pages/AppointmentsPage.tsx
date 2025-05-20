import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Appointment {
    _id: string;
    patient: {
        name: string;
        email: string;
    };
    doctor: {
        name: string;
        email: string;
        profile: {
            specialization: string;
        };
    };
    date: string;
    time: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
}

const AppointmentsPage = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const endpoint = user?.role === 'doctor'
                ? 'http://localhost:5000/api/doctors/appointments'
                : 'http://localhost:5000/api/users/appointments';

            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }

            const data = await response.json();
            // Filter out appointments with invalid data
            const validAppointments = data.filter((appointment: Appointment) =>
                appointment && appointment.doctor && appointment.doctor.name
            );
            setAppointments(validAppointments);
        } catch (error) {
            toast.error('Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="py-4">
            <div className="mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">My Appointments</h1>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                    {appointments.length === 0 ? (
                        <p className="text-center text-gray-500">No appointments found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {user?.role === 'doctor' ? (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Patient
                                            </th>
                                        ) : (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Doctor
                                            </th>
                                        )}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Reason
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Notes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {appointments.map((appointment) => (
                                        <tr key={appointment._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user?.role === 'doctor'
                                                        ? appointment.patient?.name || 'Unknown Patient'
                                                        : `Dr. ${appointment.doctor?.name || 'Unknown Doctor'}`
                                                    }
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user?.role === 'doctor'
                                                        ? appointment.patient?.email
                                                        : appointment.doctor?.profile?.specialization || 'Specialization N/A'
                                                    }
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
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {appointment.reason}
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentsPage;