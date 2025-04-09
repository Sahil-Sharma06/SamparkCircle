import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const ManageVolunteerOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        // Assuming endpoint /volunteer/opportunities returns opportunities for the logged-in NGO
        const res = await api.get("/volunteer/opportunities");
        setOpportunities(res.data.opportunities);
      } catch (err) {
        setError("Failed to load volunteer opportunities.");
      }
    };
    fetchOpportunities();
  }, []);

  const handleEdit = (opportunityId) => {
    navigate(`/dashboard/volunteer/opportunities/edit/${opportunityId}`);
  };

  const handleDelete = async (opportunityId) => {
    if (window.confirm("Are you sure you want to delete this opportunity?")) {
      try {
        await api.delete(`/volunteer/opportunities/${opportunityId}`);
        setOpportunities(opportunities.filter(op => op._id !== opportunityId));
      } catch (err) {
        alert("Failed to delete opportunity.");
      }
    }
  };

  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold">Manage Volunteer Opportunities</h1>
      {opportunities.length === 0 ? (
        <p>No volunteer opportunities posted yet.</p>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div key={opp._id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <p className="font-bold">{opp.title}</p>
                <p>{opp.description}</p>
              </div>
              <div className="flex space-x-4">
                <button onClick={() => handleEdit(opp._id)} className="px-4 py-2 bg-blue-600 rounded">Edit</button>
                <button onClick={() => handleDelete(opp._id)} className="px-4 py-2 bg-red-600 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageVolunteerOpportunities;
