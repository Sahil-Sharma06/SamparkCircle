import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const VolunteerApplicationsPage = ({ isMyApplications = false }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
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

        if (isMyApplications && decoded.role?.toLowerCase() !== "volunteer") {
          navigate("/dashboard");
          return;
        }

        if (!isMyApplications && decoded.role?.toLowerCase() !== "ngo") {
          navigate("/dashboard");
          return;
        }

        await fetchApplications(token);
      } catch (error) {
        console.error("Authentication error:", error);
        setError("Authentication failed. Please login again.");
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    checkAuth();
  }, [navigate, isMyApplications]);

  const fetchApplications = async (token) => {
    setLoading(true);
    try {
      // Determine which endpoint to use based on user role
      const endpoint = isMyApplications
        ? "http://localhost:3000/api/volunteer/applications/my-applications"
        : "http://localhost:3000/api/volunteer/applications";

      console.log("Fetching applications from:", endpoint);

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log("Applications data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch applications");
      }

      setApplications(data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError(`Error loading applications: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-12 text-white bg-gray-950">
        <div className="flex items-center justify-center w-full h-64">
          <div className="text-lg">Loading applications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 text-white bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-center">
          {isMyApplications ? "My Applications" : "Volunteer Applications"}
        </h1>

        {error && (
          <div className="p-4 mb-6 text-center text-red-400 bg-red-900 bg-opacity-20 rounded-xl">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="p-8 text-center bg-gray-800 rounded-xl">
            <p className="text-xl mb-4">No applications found</p>
            <p className="text-gray-400 mb-6">
              {isMyApplications
                ? "You haven't applied to any volunteer opportunities yet."
                : "No applications have been submitted for your opportunities."}
            </p>
            <button
              onClick={() => navigate(isMyApplications ? "/volunteer/opportunities" : "/volunteer/opportunities/manage")}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {isMyApplications ? "Browse Opportunities" : "View Your Opportunities"}
            </button>
            
            {isMyApplications && (
              <div className="mt-8 p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                <p className="text-sm text-gray-300">
                  Want to test the applications feature? 
                  <Link to="/test-application" className="ml-2 text-blue-400 hover:underline">
                    Submit a test application
                  </Link>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="p-6 transition duration-300 bg-gray-800 rounded-xl hover:bg-gray-700"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-semibold">
                      {application.opportunity?.title || "Unnamed Opportunity"}
                    </h2>
                    <p className="mt-2 text-gray-300">
                      Applied on: {formatDate(application.createdAt)}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full 
                        ${application.status === "approved" ? "bg-green-900 bg-opacity-20 text-green-400" : 
                          application.status === "rejected" ? "bg-red-900 bg-opacity-20 text-red-400" : 
                          "bg-yellow-900 bg-opacity-20 text-yellow-400"}`}
                      >
                        {application.status || "Pending"}
                      </span>
                    </div>
                    {application.volunteer && !isMyApplications && (
                      <p className="mt-2 text-gray-300">
                        Applicant: {application.volunteer.name || "Unknown"}
                      </p>
                    )}
                  </div>

                  <div>
                    {/* Different link paths for NGO vs Volunteer */}
                    <Link
                      to={isMyApplications 
                        ? `/volunteer/my-applications/${application._id}` 
                        : `/volunteer/applications/${application._id}`}
                      className="inline-block px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h3 className="mb-2 font-medium">Cover Letter:</h3>
                    <p className="text-gray-300">
                      {application.coverLetter.length > 150 ? (
                        <>
                          {application.coverLetter.substring(0, 150)}...
                          <Link 
                            to={isMyApplications 
                              ? `/volunteer/my-applications/${application._id}` 
                              : `/volunteer/applications/${application._id}`} 
                            className="ml-2 text-blue-400"
                          >
                            Read more
                          </Link>
                        </>
                      ) : (
                        application.coverLetter
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerApplicationsPage;