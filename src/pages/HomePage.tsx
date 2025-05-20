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
    <div className="min-h-screen bg-gradient-to-b from-secondary-light to-white">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">SereneCare</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/signin"
                className="text-text hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"
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
          <h1 className="text-4xl tracking-tight font-extrabold text-text sm:text-5xl md:text-6xl">
            <span className="block">Your Health Journey</span>
            <span className="block text-primary">Starts Here</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-text/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Join our comprehensive health support platform connecting patients with healthcare
            professionals. Get personalized care, join support groups, and access expert
            medical advice.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              to="/signup"
              className="bg-primary text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-primary-dark"
            >
              Get Started
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
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-text mb-2">
                {feature.title}
              </h3>
              <p className="text-text/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;