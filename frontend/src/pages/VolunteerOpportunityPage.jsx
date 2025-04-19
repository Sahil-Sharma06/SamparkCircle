import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import OpportunityCard from "../components/OpportunityCard";
import { FaSpinner, FaRegSadTear, FaPlusCircle, FaRegCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function VolunteerOpportunityPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success", "error", "info"
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id,
          role: decoded.role,
        });

        const role = decoded.role?.toLowerCase();
        // Make sure we're using the correct endpoint
        const url =
          role === "ngo"
            ? "http://localhost:3000/api/volunteer/opportunities/mine"
            : "http://localhost:3000/api/volunteer/opportunities";

        console.log("Fetching opportunities from:", url);

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Opportunities data:", data);

        if (data.opportunities && Array.isArray(data.opportunities)) {
          setOpportunities(data.opportunities);
        } else {
          console.error("Received invalid opportunities data:", data);
          showMessage("Invalid data format received from server", "error");
        }
      } catch (err) {
        console.error("❌ Error fetching opportunities:", err);
        showMessage(`Error loading opportunities: ${err.message}`, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    
    // Clear message after 5 seconds
    if (text) {
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    showMessage("Submitting application...", "info");

    try {
      const res = await fetch("http://localhost:3000/api/volunteer/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          opportunityId: selectedOpportunityId,
          coverLetter,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showMessage("Application submitted successfully!", "success");
        setSelectedOpportunityId(null);
        setCoverLetter("");
      } else {
        showMessage(data.message || "Application failed.", "error");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      showMessage("Server error while applying.", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this opportunity?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3000/api/volunteer/opportunities/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setOpportunities(opportunities.filter((opp) => opp._id !== id));
        showMessage("Opportunity deleted successfully.", "success");
      } else {
        showMessage(data.message || "Delete failed.", "error");
      }
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      showMessage("Server error while deleting.", "error");
    }
  };

  const handleApplyClick = (id, e) => {
    e.stopPropagation(); // Prevent card click
    setSelectedOpportunityId(id);
  };

  return (
    <div className="min-h-screen px-6 py-10 text-white bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto">
        <h1 className="mb-2 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          {user?.role?.toLowerCase() === "ngo" ? "Manage Your Opportunities" : "Volunteer Opportunities"}
        </h1>
        
        <p className="mb-8 text-gray-400 text-center max-w-2xl mx-auto">
          {user?.role?.toLowerCase() === "ngo" 
            ? "Create and manage volunteer opportunities for your organization" 
            : "Find meaningful ways to contribute and make a difference"}
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center justify-center ${
            messageType === "success" ? "bg-green-900/60 text-green-200" : 
            messageType === "error" ? "bg-red-900/60 text-red-200" : 
            "bg-blue-900/60 text-blue-200"
          }`}>
            {messageType === "success" && <FaRegCheckCircle className="mr-2" />}
            {messageType === "error" && <FaExclamationCircle className="mr-2" />}
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FaSpinner className="text-4xl text-indigo-500 animate-spin mb-4" />
            <p className="text-gray-400">Loading opportunities...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center bg-gray-800/50 rounded-2xl p-10 max-w-xl mx-auto">
            <FaRegSadTear className="mx-auto text-4xl text-gray-500 mb-4" />
            <p className="text-xl font-medium text-gray-300 mb-2">No opportunities available</p>
            <p className="text-gray-400">
              {user?.role?.toLowerCase() === "ngo" 
                ? "Start creating volunteer opportunities for your organization" 
                : "Check back later for new volunteer opportunities"}
            </p>
            
            {user?.role?.toLowerCase() === "ngo" && (
              <button 
                onClick={() => window.location.href = "/volunteer/opportunities/create"}
                className="mt-6 flex items-center justify-center mx-auto bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-full transition-all duration-200"
              >
                <FaPlusCircle className="mr-2" /> Create New Opportunity
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp) => (
              <div
                key={opp._id}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-102 hover:shadow-xl hover:shadow-purple-900/20"
              >
                <OpportunityCard 
                  opportunity={opp} 
                  onDelete={user?.role?.toLowerCase() === "ngo" ? handleDelete : null}
                />
                
                {user?.role?.toLowerCase() === "volunteer" && (
                  <div className="p-4 pt-0 text-center">
                    <button
                      onClick={(e) => handleApplyClick(opp._id, e)}
                      className="w-full py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                    >
                      Apply Now
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {selectedOpportunityId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-gray-800 shadow-lg rounded-2xl border border-gray-700 transform transition-all duration-300">
            <h3 className="mb-4 text-2xl font-bold text-indigo-300">Apply for Opportunity</h3>
            
            <form onSubmit={handleApply}>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Why are you interested in this opportunity?
                <textarea
                  className="w-full p-3 mt-2 text-white bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={5}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Share your relevant experience, skills, and motivation..."
                  required
                />
              </label>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors duration-200"
                  onClick={() => {
                    setSelectedOpportunityId(null);
                    setCoverLetter("");
                    setMessage("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors duration-200"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}