import React from 'react';

const FeedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Feed Komunitas</h1>
        
        <div className="space-y-6">
          {/* Sample Feed Cards */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">U{item}</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">User {item}</p>
                  <p className="text-xs text-gray-500">2 jam yang lalu</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Hidden Gem #{item}</h3>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Nanti di sini akan ada foto, deskripsi, dan lokasi tempat makan.
              </p>
              
              <div className="flex space-x-4 text-sm text-gray-500">
                <button className="hover:text-orange-600">❤️ Like</button>
                <button className="hover:text-orange-600">💬 Comment</button>
                <button className="hover:text-orange-600">📍 Location</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedPage;