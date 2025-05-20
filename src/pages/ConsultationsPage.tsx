import React, { useState, useEffect } from 'react';
import { Video, Clock, Plus } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  profile: {
    specialization: string;
  };
}

interface TimeSlot {
  time: string;
  isBooked: boolean;
}

interface Availability {
  _id: string;
  doctor: Doctor;
  date: string;
  timeSlots: TimeSlot[];
}

const ConsultationsPage = () => {
  const { user } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  useEffect(() => {
    fetchAllAvailabilities();
  }, [user]);

  const fetchAllAvailabilities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/doctors/availability', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch availabilities');
      }

      const data = await response.json();
      // Filter out availabilities with null doctors
      const validAvailabilities = Array.isArray(data)
        ? data.filter(availability => availability.doctor && availability.doctor.name)
        : [];
      setAvailabilities(validAvailabilities);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      toast.error('Failed to fetch availabilities');
      setAvailabilities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAvailability = async () => {
    if (!selectedDate || selectedTimeSlots.length === 0) {
      toast.error('Please select date and time slots');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formattedDate = selectedDate.toISOString().split('T')[0];

      const timeSlots = selectedTimeSlots.map(time => ({
        time: time,
        isBooked: false
      }));

      const response = await fetch('http://localhost:5000/api/doctors/availability', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: formattedDate,
          timeSlots: timeSlots
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add availability');
      }

      toast.success('Availability added successfully');
      setShowAvailabilityModal(false);
      setSelectedDate(null);
      setSelectedTimeSlots([]);
      fetchAllAvailabilities();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add availability');
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsBooking(true);
      const token = localStorage.getItem('token');
      const formattedDate = selectedDate.toISOString().split('T')[0];

      const response = await fetch('http://localhost:5000/api/users/appointments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          date: formattedDate,
          time: selectedTime,
          reason: reason.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to book appointment');
      }

      toast.success('Consultation booked successfully');
      setShowBookingModal(false);
      setSelectedDoctor(null);
      setSelectedTime('');
      setReason('');
      fetchAllAvailabilities();
    } catch (error: any) {
      toast.error(error.message || 'Failed to book consultation');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="sm:flex sm:items-center sm:justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          {user?.role === 'doctor' ? 'Manage Consultation Hours' : 'Available Consultations'}
        </h1>
        {user?.role === 'doctor' && (
          <button
            onClick={() => setShowAvailabilityModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Availability
          </button>
        )}
      </div>

      {user?.role !== 'doctor' && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {availabilities.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-8">
              No available consultation slots found
            </div>
          ) : (
            availabilities.map((availability) => (
              <div
                key={availability._id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Video className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Dr. {availability.doctor.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {availability.doctor.profile.specialization}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(availability.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900">Available Time Slots</h4>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {availability.timeSlots
                        .filter(slot => !slot.isBooked)
                        .map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => {
                              setSelectedDoctor(availability.doctor);
                              setSelectedTime(slot.time);
                              setSelectedDate(new Date(availability.date));
                              setShowBookingModal(true);
                            }}
                            className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            {slot.time}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Availability Modal for Doctors */}
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
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
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
                      type="button"
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
                type="button"
                onClick={() => setShowAvailabilityModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddAvailability}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Add Availability
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal for Patients */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Book Consultation with Dr. {selectedDoctor.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Selected Date & Time
                </label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedDate?.toLocaleDateString()} at {selectedTime}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reason for Consultation
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Please describe your reason for the consultation..."
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
                disabled={isBooking}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBookAppointment}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
                disabled={isBooking}
              >
                {isBooking ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsPage;