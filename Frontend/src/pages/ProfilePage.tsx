import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl text-orange-600">👤</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile User</h1>
            <p className="text-gray-600 mb-8">
              Halaman ini nanti akan menampilkan info user, posts yang dibuat, 
              dan settings akun.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">Posts</h3>
                <p className="text-2xl font-bold text-orange-600">12</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">Following</h3>
                <p className="text-2xl font-bold text-orange-600">45</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">Followers</h3>
                <p className="text-2xl font-bold text-orange-600">78</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;