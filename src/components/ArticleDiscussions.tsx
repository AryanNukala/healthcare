import React, { useState } from 'react';
import { BookOpen, MessageCircle, ThumbsUp } from 'lucide-react';

const ArticleDiscussions: React.FC = () => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const articles = [
    {
      id: 1,
      title: 'Understanding Chronic Pain Management',
      author: 'Dr. Sarah Wilson',
      specialty: 'Pain Management',
      publishedDate: '2024-03-10',
      readTime: '8 min read',
      comments: 12,
      likes: 45,
      excerpt: 'Learn about the latest approaches to managing chronic pain effectively...'
    },
    {
      id: 2,
      title: 'Anxiety and Depression: A Comprehensive Guide',
      author: 'Dr. Emily Brooks',
      specialty: 'Psychiatry',
      publishedDate: '2024-03-08',
      readTime: '10 min read',
      comments: 18,
      likes: 67,
      excerpt: 'Understanding the connection between anxiety and depression...'
    },
    {
      id: 3,
      title: 'Heart Health: Prevention and Lifestyle Changes',
      author: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      publishedDate: '2024-03-05',
      readTime: '12 min read',
      comments: 15,
      likes: 52,
      excerpt: 'Essential tips for maintaining a healthy heart through lifestyle modifications...'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Professional Articles</h2>
        
        <div className="space-y-6">
          {articles.map((article) => (
            <div key={article.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-2 rounded-lg bg-indigo-50">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900">
                    {article.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    By {article.author} • {article.specialty}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {article.excerpt}
                  </p>
                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{article.readTime}</span>
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {article.likes}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedArticle(article.title);
                        setShowCommentModal(true);
                      }}
                      className="flex items-center text-indigo-600 hover:text-indigo-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {article.comments} Comments
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Discussion: {selectedArticle}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Question or Comment
                </label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What would you like to ask about this article?"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCommentModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle comment submission logic here
                  setShowCommentModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDiscussions;