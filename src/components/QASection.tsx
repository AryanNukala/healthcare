import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, MessageCircle } from 'lucide-react';

const QASection: React.FC = () => {
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  const questions = [
    {
      id: 1,
      title: 'Managing blood sugar spikes after meals',
      author: 'Sarah Johnson',
      category: 'Diabetes Care',
      votes: 15,
      answers: 3,
      status: 'answered',
      answeredBy: 'Dr. Michael Chen',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      title: 'Recommended exercises for heart patients',
      author: 'James Wilson',
      category: 'Heart Health',
      votes: 8,
      answers: 2,
      status: 'pending',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      title: 'Anxiety management techniques',
      author: 'Emily Brooks',
      category: 'Mental Health',
      votes: 12,
      answers: 4,
      status: 'answered',
      answeredBy: 'Dr. Sarah Wilson',
      timestamp: '1 day ago'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Q&A Forum</h2>
          <button
            onClick={() => setShowAskModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Ask a Question
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900">
                    {question.title}
                  </h3>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{question.author}</span>
                    <span>•</span>
                    <span>{question.timestamp}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {question.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="inline-flex items-center text-gray-500 hover:text-gray-700">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {question.votes}
                  </button>
                  <button className="inline-flex items-center text-gray-500 hover:text-gray-700">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {question.answers}
                  </button>
                </div>
              </div>
              {question.status === 'answered' && (
                <div className="mt-3 flex items-center text-sm text-green-600">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Answered by {question.answeredBy}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ask a Question</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What would you like to ask?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option>Diabetes Care</option>
                  <option>Heart Health</option>
                  <option>Mental Health</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Details</label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Provide more details about your question..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAskModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle question submission logic here
                  setShowAskModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Post Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QASection;