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
import VolunteerApplicationsPage from "./pages/VolunteerApplicationsPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import VolunteerApplicationDetailPage from "./pages/ApplicationDetailPage"; // New import
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import JoinEventPage from "./pages/JoinEventPage";
import CreateEventPage from "./pages/CreateEventPage";

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

            {/* Make Fundraisers page accessible without login restriction */}
            <Route path="/dashboard/fundraisers" element={<FundraisersPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />

            {/* NGO Routes */}
            <Route path="/dashboard/profile" element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <NgoProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profile/create" element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <CreateNgoProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/fundraisers/create" element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <CreateFundraiserPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/fundraisers/manage" element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <ManageFundraisersPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/fundraisers/:campaignId/edit" element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <EditFundraiserPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/donations" element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <DonationHistoryPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/analytics" element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            
            {/* Volunteer Opportunity Management */}
            <Route path="/volunteer/opportunities/manage" element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <VolunteerOpportunityPage />
              </ProtectedRoute>
            } />
            <Route path="/volunteer/opportunities/create" element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <CreateOpportunityPage />
              </ProtectedRoute>
            } />
            <Route path="/volunteer/opportunities/:opportunityId/edit" element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <EditOpportunityPage />
              </ProtectedRoute>
            } />
            
            {/* NGO Application Management */}
            <Route path="/volunteer/applications" element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <VolunteerApplicationsPage />
              </ProtectedRoute>
            } />
            <Route path="/volunteer/applications/:applicationId" element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <ApplicationDetailPage />
              </ProtectedRoute>
            } />
            
            {/* Event Management */}
            <Route path="/events/manage" element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <EventsPage isManage={true} />
              </ProtectedRoute>
            } />
            <Route path="/events/create" element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <CreateEventPage />
              </ProtectedRoute>
            } />

            {/* Volunteer Routes */}
            <Route path="/events" element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <EventsPage />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId" element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <EventDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId/join" element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <JoinEventPage />
              </ProtectedRoute>
            } />
            <Route path="/volunteer/opportunities" element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <VolunteerOpportunityPage />
              </ProtectedRoute>
            } />
            <Route path="/volunteer/my-applications" element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <VolunteerApplicationsPage isMyApplications={true} />
              </ProtectedRoute>
            } />
            {/* New route for volunteer application details */}
            <Route path="/volunteer/my-applications/:applicationId" element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <VolunteerApplicationDetailPage />
              </ProtectedRoute>
            } />

            {/* Donor Routes - Using the exact paths requested */}
            <Route path="/dashboard/donations/history" element={
              <ProtectedRoute>
                <DonationHistoryPage />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/analytics" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AnalyticsPage />
              </ProtectedRoute>
            } />

            {/* Shared Routes */}
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