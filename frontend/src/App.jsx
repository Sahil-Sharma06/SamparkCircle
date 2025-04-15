import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Core Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import FundraisersPage from "./pages/fundraiserPage";
import CreateFundraiserPage from "./pages/CreateFundraiserPage";
import EditFundraiserPage from "./pages/EditFundraiserPage";
import ManageFundraisersPage from "./pages/ManageFundraisersPage";
import NgoProfilePage from "./pages/NgoProfilePage";
import CreateNgoProfilePage from "./pages/CreateNgoProfilePage";
import DonationHistoryPage from "./pages/DonationHistoryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

// Volunteer-related Pages
import VolunteerOpportunityPage from "./pages/VolunteerOpportunityPage";
import CreateOpportunityPage from "./pages/CreateOpportunityPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";

// Donation and Fundraiser Detail Pages
import DonationPage from "./pages/DonationPage";
import FundraiserDetailsPage from "./pages/FundraiserDetailsPage";

// Placeholder for edit opportunity page
const EditOpportunityPage = () => <div>Edit Opportunity Page</div>;

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
                <Route path="/dashboard/fundraisers/manage" element={<ManageFundraisersPage />} />
                <Route path="/dashboard/fundraisers/:campaignId/edit" element={<EditFundraiserPage />} />
                <Route path="/dashboard/donations" element={<DonationHistoryPage />} />
                <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
                <Route path="/dashboard/volunteer-opportunities" element={<VolunteerOpportunityPage />} />
                <Route path="/dashboard/volunteer-opportunities/create" element={<CreateOpportunityPage />} />
                <Route path="/dashboard/volunteer-opportunities/:opportunityId/edit" element={<EditOpportunityPage />} />
                <Route path="/dashboard/applications/:applicationId" element={<ApplicationDetailPage />} />
              </Route>

              {/* Volunteer Routes */}
              <Route element={<ProtectedRoute allowedRoles={["volunteer"]} />}>
                <Route path="/dashboard/events" element={<div>Events Page (To be implemented)</div>} />
                <Route path="/dashboard/volunteer-opportunities" element={<VolunteerOpportunityPage />} />
                <Route path="/dashboard/applications" element={<div>My Applications (To be implemented)</div>} />
              </Route>

              {/* Donor Routes */}
              <Route element={<ProtectedRoute allowedRoles={["donor"]} />}>
                <Route path="/dashboard/fundraisers" element={<FundraisersPage />} />
                <Route path="/dashboard/donations" element={<DonationHistoryPage />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/dashboard/admin/analytics" element={<AnalyticsPage />} />
              </Route>
            </Route>

            {/* Shared Routes - Available to both authenticated and unauthenticated users */}
            <Route path="/donate/:id" element={<DonationPage />} />
            <Route path="/fundraiser-details/:id" element={<FundraiserDetailsPage />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;