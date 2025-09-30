import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Temukan Hidden Gems Kuliner Terbaik
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Platform komunitas untuk berbagi dan menemukan tempat makan tersembunyi yang menakjubkan
          </p>
          
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold mb-4">🍽️ Welcome to HiddenBites!</h2>
            <p className="text-gray-600">
              Ini adalah halaman Home - nanti kita akan tambahkan hero section, 
              featured posts, dan search functionality di sini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;