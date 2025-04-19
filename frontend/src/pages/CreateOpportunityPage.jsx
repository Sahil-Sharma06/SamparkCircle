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
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      setMessage("You must be logged in as an NGO.");
      return;
    }

    try {
      const decoded = jwtDecode(storedToken);
      if (decoded.role?.toLowerCase() !== "ngo") {
        setMessage("Only NGO accounts can create events.");
      } else {
        setToken(storedToken);
      }
    } catch (err) {
      setMessage("Invalid token.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Event created!");
        setTimeout(() => navigate("/dashboard/events"), 1000);
      } else {
        setMessage(data.message || "❌ Failed to create.");
      }
    } catch {
      setMessage("❌ Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <h1 className="mb-4 text-3xl font-bold text-center">Create Event (NGO)</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl p-6 mx-auto space-y-4 bg-gray-800 rounded">
        <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />
        <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} required />
        <Input label="Location" name="location" value={formData.location} onChange={handleChange} required />
        <Input label="Date" name="eventDate" type="date" value={formData.eventDate} onChange={handleChange} required />
        <Input label="Image URL" name="image" value={formData.image} onChange={handleChange} />
        <button className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
        {message && <p className="mt-2 text-sm text-center text-red-400">{message}</p>}
      </form>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 text-sm">{label}</label>
    <input {...props} className="w-full p-2 bg-gray-700 rounded" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 text-sm">{label}</label>
    <textarea {...props} rows="4" className="w-full p-2 bg-gray-700 rounded" />
  </div>
);

export default CreateEventPage;
