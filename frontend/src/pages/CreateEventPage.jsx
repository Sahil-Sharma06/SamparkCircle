import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    image: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        setMessage("You must be logged in as an NGO.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.role?.toLowerCase() !== "ngo") {
          setMessage("Only NGO accounts can create events.");
          setTimeout(() => navigate("/dashboard"), 2000);
          return;
        }
        
        setUser({
          id: decoded.id,
          name: decoded.name,
          role: decoded.role
        });
      } catch (err) {
        console.error("Token validation error:", err);
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
      const res = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage("✅ Event created successfully!");
        // Reset form
        setFormData({
          title: "",
          description: "",
          location: "",
          eventDate: "",
          image: ""
        });
        // Redirect after success message
        setTimeout(() => navigate("/events/manage"), 1500);
      } else {
        setMessage(`❌ ${data.message || "Failed to create event. Please try again."}`);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setMessage("❌ Server error. Please check your connection and try again.");
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
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-center">Create Event</h1>
        
        {message && (
          <div className={`p-4 mb-6 text-center rounded ${getMessageClass()}`}>
            {message}
          </div>
        )}
        
        {user ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-gray-800 rounded-xl">
            <Input 
              label="Event Title *" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              maxLength={100}
            />
            
            <Textarea 
              label="Description *" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              rows={5}
            />
            
            <Input 
              label="Location *" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              required 
            />
            
            <Input 
              label="Event Date *" 
              name="eventDate" 
              type="date" 
              value={formData.eventDate} 
              onChange={handleChange} 
              required 
              min={new Date().toISOString().split('T')[0]} // Set min date to today
            />
            
            <Input 
              label="Image URL (Optional)" 
              name="image" 
              value={formData.image} 
              onChange={handleChange} 
              placeholder="https://example.com/image.jpg"
            />
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700" 
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Event"}
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
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block mb-2 text-sm font-medium">{label}</label>
    <input 
      {...props} 
      className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block mb-2 text-sm font-medium">{label}</label>
    <textarea 
      {...props} 
      className="w-full p-3 text-white bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
    />
  </div>
);

export default CreateEventPage;