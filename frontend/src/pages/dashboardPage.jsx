import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/dashboard";

const DashboardPage = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
};

export default DashboardPage;
