import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DonationHistoryPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    // Debug: Log user information
    console.log("Current user:", user);
    console.log("User role:", user?.role);
    
    const fetchDonations = async () => {
      try {
        // Always use lowercase roles to match what's in the database
        const endpoint = user?.role?.toLowerCase() === "ngo" 
          ? "/donations/ngo/received" 
          : "/donations/history";
        
        console.log("Fetching donations from endpoint:", endpoint);
        const res = await api.get(endpoint);
        setDonations(res.data.donations || []);
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to load donation history. " + (err.response?.data?.message || ""));
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchDonations();
    } else {
      setError("Please log in to view your donation history");
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <p>{error}</p>
          <p>User role: {user?.role || "Not logged in"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Donation History</h2>
      
      <div className="mt-4 list-group">
        {donations.length > 0 ? (
          donations.map(donation => (
            <div key={donation._id} className="list-group-item">
              <h5>
                {user?.role?.toLowerCase() === "ngo" 
                  ? `From: ${donation.donor?.name || 'Anonymous'}` 
                  : `To: ${donation.ngo?.name || 'Unknown NGO'}`}
              </h5>
              <p>Amount: ₹{donation.amount}</p>
              <p>Date: {new Date(donation.donatedAt).toLocaleDateString()}</p>
              <p>Status: {donation.status}</p>
            </div>
          ))
        ) : (
          <p>No donations found.</p>
        )}
      </div>
    </div>
  );
};

export default DonationHistoryPage;