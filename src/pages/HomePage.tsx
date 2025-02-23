import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, MessageCircle, Video } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Heart,
      title: 'Expert Healthcare',
      description: 'Connect with verified healthcare professionals for personalized care.',
    },
    {
      icon: Users,
      title: 'Support Groups',
      description: 'Join condition-specific groups and share experiences with others.',
    },
    {
      icon: MessageCircle,
      title: 'Secure Messaging',
      description: 'Communicate privately with doctors and other members.',
    },
    {
      icon: Video,
      title: 'Virtual Consultations',
      description: 'Schedule video consultations from the comfort of your home.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">HealthConnect</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/signin"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Your Health Journey</span>
            <span className="block text-indigo-600">Starts Here</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Join our comprehensive health support platform connecting patients with healthcare
            professionals. Get personalized care, join support groups, and access expert
            medical advice.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link
              to="/signup"
              className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700"
            >
              Get Started
            </Link>
            <Link
              to="/admin/login"
              className="text-indigo-600 bg-white border border-indigo-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-50"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;