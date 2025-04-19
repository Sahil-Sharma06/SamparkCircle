import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ApplicationDetailPage = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id,
          role: decoded.role
        });

        await fetchApplicationDetails(token);
      } catch (error) {
        console.error("Authentication error:", error);
        setError("Authentication failed. Please login again.");
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    checkAuth();
  }, [applicationId, navigate]);

  const fetchApplicationDetails = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/volunteer/applications/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch application details");
      }

      const data = await response.json();
      setApplication(data.application);
      
      // Pre-fill feedback if it exists
      if (data.application.feedback) {
        setFeedback(data.application.feedback);
      }
    } catch (error) {
      console.error("Error fetching application details:", error);
      setError("Error loading application details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!user || user.role?.toLowerCase() !== "ngo") return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/volunteer/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          },
          body: JSON.stringify({ 
            status: newStatus,
            feedback: feedback.trim() !== "" ? feedback : undefined
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      const data = await response.json();
      setApplication({
        ...application,
        status: newStatus,
        feedback: feedback.trim() !== "" ? feedback : application.feedback
      });

      // Display success message
      setError(`Application ${newStatus.toLowerCase()} successfully`);
      setTimeout(() => setError(""), 3000);
    } catch (error) {
      console.error("Error updating application status:", error);
      setError("Failed to update application status");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500 bg-opacity-20 text-yellow-400";
      case "approved":
        return "bg-green-500 bg-opacity-20 text-green-400";
      case "rejected":
        return "bg-red-500 bg-opacity-20 text-red-400";
      default:
        return "bg-gray-500 bg-opacity-20 text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-12 text-white bg-gray-950">
        <div className="flex items-center justify-center w-full h-64">
          <div className="text-lg">Loading application details...</div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen px-6 py-12 text-white bg-gray-950">
        <div className="max-w-3xl mx-auto p-8 bg-gray-800 rounded-xl">
          <h1 className="mb-4 text-2xl font-bold text-center">Application Not Found</h1>
          <p className="text-center text-gray-300">
            The application you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canUpdateStatus = user?.role?.toLowerCase() === "ngo" && application.status === "pending";
  const isMyApplication = user?.role?.toLowerCase() === "volunteer";

  return (
    <div className="min-h-screen px-6 py-12 text-white bg-gray-950">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-3 py-2 text-sm bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>

          <div
            className={`px-4 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(
              application.status
            )}`}
          >
            {application.status || "Pending"}
          </div>
        </div>

        {error && (
          <div className={`p-4 mb-6 text-center rounded-xl ${
            error.includes("successfully") 
              ? "bg-green-900 bg-opacity-20 text-green-400" 
              : "bg-red-900 bg-opacity-20 text-red-400"
          }`}>
            {error}
          </div>
        )}

        <div className="p-8 bg-gray-800 rounded-xl">
          <h1 className="mb-6 text-2xl font-bold">
            {application.opportunity?.title || "Application Details"}
          </h1>

          <div className="grid gap-6 mb-8 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-xl font-medium">Application Information</h2>
              <div className="space-y-2 text-gray-300">
                <p>
                  <span className="font-medium text-white">Status:</span>{" "}
                  {application.status || "Pending"}
                </p>
                <p>
                  <span className="font-medium text-white">Applied on:</span>{" "}
                  {formatDate(application.createdAt)}
                </p>
                {application.updatedAt && application.updatedAt !== application.createdAt && (
                  <p>
                    <span className="font-medium text-white">Last updated:</span>{" "}
                    {formatDate(application.updatedAt)}
                  </p>
                )}
              </div>
            </div>

            <div>
              {isMyApplication ? (
                <>
                  <h2 className="mb-3 text-xl font-medium">Organization Details</h2>
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <span className="font-medium text-white">Name:</span>{" "}
                      {application.ngo?.name || "Unknown Organization"}
                    </p>
                    {application.ngo?.email && (
                      <p>
                        <span className="font-medium text-white">Email:</span>{" "}
                        {application.ngo.email}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mb-3 text-xl font-medium">Applicant Details</h2>
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <span className="font-medium text-white">Name:</span>{" "}
                      {application.volunteer?.name || "Unknown Volunteer"}
                    </p>
                    {application.volunteer?.email && (
                      <p>
                        <span className="font-medium text-white">Email:</span>{" "}
                        {application.volunteer.email}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-3 text-xl font-medium">Cover Letter</h2>
            <div className="p-4 bg-gray-900 rounded-lg">
              <p className="whitespace-pre-wrap text-gray-300">
                {application.coverLetter || "No cover letter provided."}
              </p>
            </div>
          </div>

          {(application.feedback || canUpdateStatus) && (
            <div className="mb-8">
              <h2 className="mb-3 text-xl font-medium">Feedback</h2>
              {canUpdateStatus ? (
                <div>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full p-3 mb-3 text-white bg-gray-900 rounded-lg"
                    rows={4}
                    placeholder="Provide feedback to the applicant (optional)"
                  />
                </div>
              ) : application.feedback ? (
                <div className="p-4 bg-gray-900 rounded-lg">
                  <p className="whitespace-pre-wrap text-gray-300">
                    {application.feedback}
                  </p>
                </div>
              ) : null}
            </div>
          )}

          <div className="pt-6 border-t border-gray-700">
            <h2 className="mb-4 text-xl font-medium">Opportunity Details</h2>
            {application.opportunity ? (
              <div className="space-y-3 text-gray-300">
                <p>
                  <span className="font-medium text-white">Title:</span>{" "}
                  {application.opportunity.title}
                </p>
                <p>
                  <span className="font-medium text-white">Location:</span>{" "}
                  {application.opportunity.location}
                </p>
                <div>
                  <span className="font-medium text-white">Description:</span>
                  <p className="mt-1 ml-4">{application.opportunity.description}</p>
                </div>
                {application.opportunity.requirements && (
                  <div>
                    <span className="font-medium text-white">Requirements:</span>
                    <p className="mt-1 ml-4">{application.opportunity.requirements}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400">Opportunity details not available.</p>
            )}
          </div>

          {canUpdateStatus && (
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => handleStatusUpdate("rejected")}
                className="px-5 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => handleStatusUpdate("approved")}
                className="px-5 py-2 bg-green-600 rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;