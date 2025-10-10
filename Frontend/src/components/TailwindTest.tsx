// src/components/TailwindTest.tsx
import React from 'react';

const TailwindTest: React.FC = () => {
  return (
    <div className="p-8 bg-red-100 border-2 border-red-500">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        🎨 Tailwind Test Component
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-500 text-white p-4 rounded-lg">
          <h3 className="font-semibold">Orange Box</h3>
          <p className="text-sm">Custom orange color test</p>
        </div>
        
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <h3 className="font-semibold">Green Box</h3>
          <p className="text-sm">Standard Tailwind green</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-400 to-pink-600 text-white p-4 rounded-lg">
          <h3 className="font-semibold">Gradient Box</h3>
          <p className="text-sm">Gradient test</p>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-lg text-gray-700 mb-4">
          Kalau kamu bisa lihat styling di atas, berarti Tailwind udah jalan! ✅
        </p>
        <p className="text-sm text-gray-500">
          Kalau masih plain text tanpa styling, berarti ada masalah config 🚨
        </p>
      </div>
    </div>
  );
};

export default TailwindTest;