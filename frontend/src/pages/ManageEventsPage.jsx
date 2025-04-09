import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Assuming endpoint /events returns events created by the current NGO if filtered by token
        const res = await api.get("/events");
        setEvents(res.data.events);
      } catch (err) {
        setError("Failed to load events.");
      }
    };
    fetchEvents();
  }, []);

  const handleEdit = (eventId) => {
    navigate(`/dashboard/events/edit/${eventId}`);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${eventId}`);
        setEvents(events.filter(ev => ev._id !== eventId));
      } catch (err) {
        alert("Failed to delete event.");
      }
    }
  };

  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold">Manage Events</h1>
      {events.length === 0 ? (
        <p>No events created.</p>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => (
            <div key={ev._id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <p className="font-bold">{ev.title}</p>
                <p>{ev.description}</p>
                <p>{new Date(ev.eventDate).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-4">
                <button onClick={() => handleEdit(ev._id)} className="px-4 py-2 bg-blue-600 rounded">Edit</button>
                <button onClick={() => handleDelete(ev._id)} className="px-4 py-2 bg-red-600 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEventsPage;
