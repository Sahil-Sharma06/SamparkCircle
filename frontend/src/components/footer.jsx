import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-6 text-gray-300 bg-gray-900 bg-opacity-90 backdrop-blur-lg">
      <div className="flex flex-col items-center justify-between px-6 mx-auto max-w-7xl md:flex-row">
        
        {/* Branding & Tagline */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-semibold text-gray-100">SamparkCircle</h2>
          <p className="text-sm text-gray-400">Connecting NGOs, Volunteers, and Donors</p>
        </div>

        {/* Navigation Links */}
        <div className="flex mt-4 space-x-6 text-sm md:mt-0">
          <FooterLink to="/" text="Home" />
          <FooterLink to="/dashboard" text="Dashboard" />
          <FooterLink to="/signup" text="Sign Up" />
          <FooterLink to="/login" text="Login" />
        </div>

        {/* Copyright */}
        <div className="mt-4 text-sm text-center text-gray-400 md:mt-0 md:text-right">
          &copy; {new Date().getFullYear()} SamparkCircle. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

// 🔹 Reusable Footer Link Component
const FooterLink = ({ to, text }) => (
  <Link
    to={to}
    className="text-gray-400 transition duration-300 hover:text-gray-200"
  >
    {text}
  </Link>
);

export default Footer;
