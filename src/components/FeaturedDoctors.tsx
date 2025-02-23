import React from 'react';

const FeaturedDoctors: React.FC = () => {
  const doctors = [
    {
      name: 'Dr. Sarah Wilson',
      specialty: 'Cardiologist',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      rating: 4.9,
    },
    {
      name: 'Dr. Michael Chen',
      specialty: 'Neurologist',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      rating: 4.8,
    },
    {
      name: 'Dr. Emily Brooks',
      specialty: 'Psychiatrist',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
      rating: 4.9,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Featured Doctors</h2>
        <div className="mt-6 space-y-6">
          {doctors.map((doctor) => (
            <div key={doctor.name} className="flex items-center space-x-4">
              <img
                className="h-12 w-12 rounded-full"
                src={doctor.image}
                alt={doctor.name}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doctor.name}
                </p>
                <p className="text-sm text-gray-500 truncate">{doctor.specialty}</p>
              </div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {doctor.rating} ★
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedDoctors;