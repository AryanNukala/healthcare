import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, FileText, Video, MessageCircle, Calendar, Check, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface Appointment {
    _id: string;
    patient: {
        _id: string;
        name: string;
        email: string;
    };
    date: string;
    time: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
}

interface Availability {
    _id: string;
    date: string;
    timeSlots: Array<{
        time: string;
        isBooked: boolean;
    }>;
}

const DoctorDashboard: React.FC = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [notes, setNotes] = useState('');
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    const [availabilityDate, setAvailabilityDate] = useState<Date | null>(null);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);

    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const stats = [
        {
            name: 'Pending Appointments',
            value: appointments.filter(a => a.status === 'pending').length,
            icon: Calendar,
        },
        {
            name: 'Assigned Groups',
            value: user?.profile?.assignedGroups?.length || 0,
            icon: Users,
        },
        {
            name: 'Published Articles',
            value: '8',
            icon: FileText,
        },
        {
            name: 'Active Consultations',
            value: '3',
            icon: Video,
        },
    ];

    useEffect(() => {
        fetchAppointments();
        fetchAvailability();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/doctors/appointments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            toast.error('Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailability = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/doctors/availability', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setAvailabilities(data);
        } catch (error) {
            toast.error('Failed to fetch availability');
        }
    };

    const handleAppointmentAction = async (status: 'approved' | 'rejected') => {
        if (!selectedAppointment) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/doctors/appointments/${selectedAppointment._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status, notes })
            });

            if (response.ok) {
                const updatedAppointment = await response.json();
                setAppointments(appointments.map(app =>
                    app._id === updatedAppointment._id ? updatedAppointment : app
                ));
                toast.success(`Appointment ${status}`);
                setShowActionModal(false);
                setSelectedAppointment(null);
                setNotes('');
            }
        } catch (error) {
            toast.error('Failed to update appointment');
        }
    };

    const handleAddAvailability = async () => {
        if (!availabilityDate || selectedTimeSlots.length === 0) {
            toast.error('Please select date and time slots');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/doctors/availability', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: availabilityDate,
                    timeSlots: selectedTimeSlots
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add availability');
            }

            toast.success('Availability added successfully');
            setShowAvailabilityModal(false);
            setAvailabilityDate(null);
            setSelectedTimeSlots([]);
            fetchAvailability();
        } catch (error) {
            toast.error('Failed to add availability');
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
                <h2 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Welcome back, Dr. {user?.name}
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
                        <h3 className="text-lg font-medium text-gray-900 mb-6">Appointment Requests</h3>
                        {appointments.length === 0 ? (
                            <div className="text-center text-gray-500">No appointments found</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Patient
                                            </th>
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
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {appointments.map((appointment) => (
                                            <tr key={appointment._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {appointment.patient.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {appointment.patient.email}
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {appointment.status === 'pending' && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedAppointment(appointment);
                                                                    setShowActionModal(true);
                                                                }}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Take Action
                                                            </button>
                                                        </div>
                                                    )}
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

            {/* Availability Section */}
            <div className="mt-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900">My Availability</h3>
                            <button
                                onClick={() => setShowAvailabilityModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Availability
                            </button>
                        </div>

                        <div className="space-y-4">
                            {availabilities.map((availability) => (
                                <div key={availability._id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">
                                                {new Date(availability.date).toLocaleDateString()}
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {availability.timeSlots.map((slot, index) => (
                                                    <span
                                                        key={index}
                                                        className={`px-2 py-1 rounded text-sm ${slot.isBooked
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-green-100 text-green-800'
                                                            }`}
                                                    >
                                                        {slot.time}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Modal */}
            {showActionModal && selectedAppointment && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Appointment Action
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Patient
                                </label>
                                <div className="mt-1 text-sm text-gray-900">
                                    {selectedAppointment.patient.name}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Notes
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    rows={3}
                                    placeholder="Add any notes about this appointment..."
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowActionModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleAppointmentAction('rejected')}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md flex items-center"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                            </button>
                            <button
                                onClick={() => handleAppointmentAction('approved')}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md flex items-center"
                            >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Availability Modal */}
            {showAvailabilityModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Add Availability
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Select Date
                                </label>
                                <DatePicker
                                    selected={availabilityDate}
                                    onChange={(date) => setAvailabilityDate(date)}
                                    minDate={new Date()}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    dateFormat="MMMM d, yyyy"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Select Time Slots
                                </label>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => {
                                                if (selectedTimeSlots.includes(time)) {
                                                    setSelectedTimeSlots(selectedTimeSlots.filter(t => t !== time));
                                                } else {
                                                    setSelectedTimeSlots([...selectedTimeSlots, time]);
                                                }
                                            }}
                                            className={`px-3 py-2 rounded-md text-sm font-medium ${selectedTimeSlots.includes(time)
                                                ? 'bg-indigo-600 text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowAvailabilityModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddAvailability}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                            >
                                Add Availability
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;