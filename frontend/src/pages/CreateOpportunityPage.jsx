import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function CreateOpportunityPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is an NGO
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setMessage("You must be logged in as an NGO to create opportunities.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      
      try {
        const decoded = jwtDecode(token);
        if (decoded.role?.toLowerCase() !== "ngo") {
          setMessage("Only NGO accounts can create volunteer opportunities.");
          setTimeout(() => navigate("/dashboard"), 2000);
          return;
        }
        
        setUser({
          id: decoded.id,
          name: decoded.name,
          role: decoded.role
        });
      } catch (error) {
        console.error("Auth error:", error);
        setMessage("Invalid authentication. Please login again.");
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/api/volunteer/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Volunteer opportunity created successfully!");
        // Clear form after successful submission
        setFormData({
          title: "",
          description: "",
          requirements: "",
          location: "",
        });
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate("/volunteer/opportunities/manage");
        }, 1500);
      } else {
        setMessage(`❌ Error: ${data.message || "Failed to create opportunity"}`);
      }
    } catch (error) {
      console.error("Error creating opportunity:", error);
      setMessage("❌ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Add helper for message styling
  const getMessageClass = () => {
    if (!message) return "";
    return message.startsWith("✅") 
      ? "text-green-400"
      : "text-red-400";
  };

  return (
    <div className="min-h-screen px-6 py-10 text-white bg-gray-950">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-center">Create Volunteer Opportunity</h1>

        {message && (
          <div className={`p-4 mb-6 text-center rounded-xl ${getMessageClass()} ${message.startsWith("✅") ? "bg-green-900 bg-opacity-20" : "bg-red-900 bg-opacity-20"}`}>
            {message}
          </div>
        )}

        {user ? (
          <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded-xl">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Title *
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 mt-1 text-white bg-gray-700 rounded-lg"
                  required
                  maxLength={100}
                  placeholder="e.g., Volunteer Teachers Needed"
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Description *
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 mt-1 text-white bg-gray-700 rounded-lg"
                  rows={5}
                  required
                  placeholder="Provide details about the volunteer opportunity..."
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Requirements (Optional)
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  className="w-full p-3 mt-1 text-white bg-gray-700 rounded-lg"
                  rows={3}
                  placeholder="e.g., Teaching experience, Available weekends, etc."
                />
              </label>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">
                Location *
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-3 mt-1 text-white bg-gray-700 rounded-lg"
                  required
                  placeholder="e.g., Mumbai, Delhi, Remote"
                />
              </label>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 text-gray-200 bg-gray-700 rounded-lg hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Opportunity"}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center bg-gray-800 rounded-xl">
            <p>Validating your credentials...</p>
          </div>
        )}
      </div>
    </div>
  );
}