import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const NotFoundPage = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-blue-600">404</h1>
          <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
          <p className="text-gray-600 mt-2">The page you are looking for doesn't exist or has been moved.</p>
          <Link to="/" className="mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Go Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage; 