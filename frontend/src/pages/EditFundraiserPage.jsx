import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const EditFundraiserPage = () => {
  const { fundraiserId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFundraiser = async () => {
      try {
        const res = await api.get(`/fundraisers/${fundraiserId}`);
        const fundraiser = res.data.campaign || res.data.fundraiser;
        setFormData({
          title: fundraiser.title,
          description: fundraiser.description,
          goal: fundraiser.goal,
          image: fundraiser.image,
        });
      } catch (err) {
        setError("Failed to load fundraiser.");
      } finally {
        setLoading(false);
      }
    };
    fetchFundraiser();
  }, [fundraiserId]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/fundraisers/${fundraiserId}`, {
        title: formData.title,
        description: formData.description,
        goal: Number(formData.goal),
        image: formData.image,
      });
      alert("Fundraiser updated successfully");
      navigate("/dashboard/fundraisers");  // Redirect to the list page
    } catch (err) {
      setError("Failed to update fundraiser.");
    }
  };

  if (loading) return <div className="p-8 text-white">Loading fundraiser...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
      <div className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold">Edit Fundraiser</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 bg-gray-700 border rounded" required/>
          </div>
          <div>
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 bg-gray-700 border rounded" required/>
          </div>
          <div>
            <label>Goal (INR)</label>
            <input type="number" name="goal" value={formData.goal} onChange={handleChange} className="w-full p-2 bg-gray-700 border rounded" required/>
          </div>
          <div>
            <label>Image URL (optional)</label>
            <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full p-2 bg-gray-700 border rounded"/>
          </div>
          <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-500">
            Update Fundraiser
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditFundraiserPage;
