import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import OpportunityCard from "../components/OpportunityCard";

export default function VolunteerOpportunityPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
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
          setMessage("Invalid data format received from server");
        }
      } catch (err) {
        console.error("❌ Error fetching opportunities:", err);
        setMessage(`Error loading opportunities: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");

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
        setMessage("✅ Application submitted successfully!");
        setSelectedOpportunityId(null);
        setCoverLetter("");
      } else {
        setMessage(data.message || "❌ Application failed.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setMessage("Server error while applying.");
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
        alert("✅ Opportunity deleted successfully.");
      } else {
        alert(data.message || "Delete failed.");
      }
    } catch (error) {
      console.error("Error deleting opportunity:", error);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 text-white bg-gray-950">
      <h1 className="mb-6 text-3xl font-bold text-center">
        {user?.role?.toLowerCase() === "ngo" ? "Manage Your Opportunities" : "Volunteer Opportunities"}
      </h1>

      {message && <p className="mb-4 text-center">{message}</p>}

      {loading ? (
        <p className="text-center">Loading opportunities...</p>
      ) : opportunities.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-400">No opportunities available.</p>
          {user?.role?.toLowerCase() === "ngo" && (
            <p className="mt-4 text-gray-300">
              Use the "Create Opportunity" button in the dashboard to add new volunteer opportunities.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opp) => (
            <div
              key={opp._id}
              onClick={() =>
                user?.role?.toLowerCase() === "volunteer" && setSelectedOpportunityId(opp._id)
              }
              className="cursor-pointer"
            >
              <OpportunityCard 
                opportunity={opp} 
                onDelete={user?.role?.toLowerCase() === "ngo" ? handleDelete : null} 
              />
            </div>
          ))}
        </div>
      )}

      {selectedOpportunityId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-full max-w-md p-6 bg-gray-800 shadow-lg rounded-2xl">
            <h3 className="mb-4 text-2xl font-bold">Apply for Opportunity</h3>
            <form onSubmit={handleApply}>
              <label className="block mb-2 text-sm font-medium">
                Cover Letter
                <textarea
                  className="w-full p-2 mt-1 text-white bg-gray-700 rounded-xl"
                  rows={5}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                />
              </label>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl"
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
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl"
                >
                  Submit
                </button>
              </div>
              {message && <p className="mt-3 text-sm text-gray-300">{message}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}