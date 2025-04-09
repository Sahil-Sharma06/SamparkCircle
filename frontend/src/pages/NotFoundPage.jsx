import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-6xl text-white">404</h1>
      <p className="mt-4 text-2xl text-gray-300">Page Not Found</p>
      <Link to="/" className="mt-6 text-blue-500 hover:underline">
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
