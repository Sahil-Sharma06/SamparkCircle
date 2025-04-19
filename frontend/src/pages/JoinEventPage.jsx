import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const JoinEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/events/${eventId}`);
      const data = await res.json();
      if (res.ok) setEvent(data.event);
      else setMessage("Failed to load event");
    } catch {
      setMessage("Error loading event");
    }
  };

  const handleJoin = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return setMessage("You must be logged in");

    const decoded = jwtDecode(token);
    if (decoded.role?.toLowerCase() !== "volunteer") {
      return setMessage("Only volunteers can join events");
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/event-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ eventId, coverLetter })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Successfully joined event!");
        setTimeout(() => navigate("/dashboard/events"), 1500);
      } else {
        setMessage(data.message || "Failed to join");
      }
    } catch {
      setMessage("Error joining event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  if (!event) {
    return <div className="p-6 text-white">Loading event...</div>;
  }

  return (
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <h1 className="mb-4 text-3xl font-bold">Join: {event.title}</h1>
      <p className="mb-2 text-gray-400">Location: {event.location}</p>
      <p className="mb-6 text-gray-400">Date: {new Date(event.eventDate).toLocaleDateString()}</p>

      <textarea
        className="w-full p-4 mb-4 bg-gray-800 rounded"
        placeholder="Optional: Write a short message (cover letter)"
        rows={5}
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
      />

      <button
        onClick={handleJoin}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        {loading ? "Joining..." : "Join Event"}
      </button>

      {message && <p className="mt-4 text-red-400">{message}</p>}
    </div>
  );
};

export default JoinEventPage;
