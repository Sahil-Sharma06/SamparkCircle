import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-6 mt-12 text-white bg-blue-600">
      <div className="flex flex-col items-center justify-between max-w-6xl px-6 mx-auto md:flex-row">
        {/* Left Section - Branding */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">SamparkCircle</h2>
          <p className="text-sm text-gray-200">Connecting NGOs, Volunteers, and Donors</p>
        </div>

        {/* Middle Section - Links */}
        <div className="flex space-x-6 text-sm">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/signup" className="hover:underline">Sign Up</Link>
          <Link to="/login" className="hover:underline">Login</Link>
        </div>

        {/* Right Section - Copyright */}
        <div className="text-sm text-gray-200">
          &copy; {new Date().getFullYear()} SamparkCircle. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;