import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import DataPage from './pages/DataPage';
import './index.css'; // Ensure styles are loaded

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      <nav className="bg-white shadow mb-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="font-bold text-xl text-blue-600">FinBERT Classifier</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`${currentPage === 'home' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ml-8`}
                >
                  首页
                </button>
                <button
                  onClick={() => setCurrentPage('data')}
                  className={`${currentPage === 'data' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ml-8`}
                >
                  数据与训练
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'data' && <DataPage />}
      </main>
    </div>
  );
}

export default App;
