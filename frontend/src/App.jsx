import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import FundraisersPage from "./pages/fundraiserPage";
import CreateFundraiserPage from "./pages/CreateFundraiserPage";
import NgoProfilePage from "./pages/NgoProfilePage"; // NGO Profile Page
import CreateNgoProfilePage from "./pages/CreateNgoProfilePage"; // Import the new Create Profile Page
import DonationHistoryPage from "./pages/DonationHistoryPage"; // Import the Donation History Page
import AnalyticsPage from "./pages/AnalyticsPage"; // Import the new Analytics Page
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen text-gray-200 bg-gray-950">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* NGO Routes */}
              <Route element={<ProtectedRoute allowedRoles={["ngo"]} />}>
                <Route path="/dashboard/profile" element={<NgoProfilePage />} />
                <Route path="/dashboard/profile/create" element={<CreateNgoProfilePage />} />
                <Route path="/dashboard/fundraisers/create" element={<CreateFundraiserPage />} />
                <Route path="/dashboard/donations" element={<DonationHistoryPage />} /> {/* NGO donation history */}
                <Route path="/dashboard/analytics" element={<AnalyticsPage />} /> {/* NGO analytics */}
              </Route>

              {/* Volunteer Routes */}
              <Route element={<ProtectedRoute allowedRoles={["volunteer"]} />}>
                <Route path="/dashboard/events" element={<div>Events Page (To be implemented)</div>} />
              </Route>

              {/* Donor Routes */}
              <Route element={<ProtectedRoute allowedRoles={["donor"]} />}>
                <Route path="/dashboard/fundraisers" element={<FundraisersPage />} />
                <Route path="/dashboard/donations" element={<DonationHistoryPage />} /> {/* Donor donation history */}
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/dashboard/admin/analytics" element={<AnalyticsPage />} /> {/* Admin analytics */}
              </Route>
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;