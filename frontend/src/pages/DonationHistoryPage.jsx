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
    const fetchDonations = async () => {
      try {
        // CORRECTED: Remove the /api prefix since api.js already adds it
        const endpoint = user?.role === "NGO" || user?.role === "ngo" 
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

  // Rest of your component remains the same
}

export default DonationHistoryPage;