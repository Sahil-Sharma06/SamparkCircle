import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaSyncAlt } from "react-icons/fa";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinedEvents, setJoinedEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/events");
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || []);
        setError("");
      } else {
        setError(data.message || "Failed to load events");
      }
    } catch (err) {
      console.error("❌ Error fetching events:", err);
      setError("Server error while loading events");
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedEvents = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/api/event-applications/my-events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setJoinedEvents(data.joinedEventIds || []);
      }
    } catch (err) {
      console.error("Error fetching joined events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length) fetchJoinedEvents();
  }, [events]);

  if (loading) {
    return <div className="p-8 text-center text-white">Loading events...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-400">{error}</div>;
  }

  return (
    <div className="min-h-screen p-8 text-gray-200 bg-gray-900">
      <div className="flex items-center justify-between mx-auto mb-6 max-w-7xl">
        <h1 className="text-3xl font-semibold">Upcoming Volunteer Events</h1>
        <button
          onClick={fetchEvents}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-700"
        >
          <FaSyncAlt /> Refresh
        </button>
      </div>

      <div className="grid gap-8 mx-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl">
        {events.map((event) => {
          const hasJoined = joinedEvents.includes(event._id);

          return (
            <div
              key={event._id}
              className="flex flex-col p-6 transition duration-300 bg-gray-800 shadow-md rounded-xl hover:bg-gray-700"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt="Event"
                  className="object-cover w-full h-48 mb-4 rounded-lg"
                />
              )}
              <h2 className="mb-2 text-xl font-bold">{event.title}</h2>
              <div className="flex items-center mb-1 text-sm text-gray-400">
                <FaCalendarAlt className="mr-2" />
                <span>{new Date(event.eventDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center mb-1 text-sm text-gray-400">
                <FaMapMarkerAlt className="mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <FaUsers className="mr-2" />
                <span>Organized by NGO</span>
              </div>

              <div className="flex gap-3 pt-4 mt-auto">
                {hasJoined ? (
                  <div className="flex-1 px-4 py-2 text-sm text-center text-green-400 border border-green-400 rounded-lg">
                    ✅ You are already applied for this event
                  </div>
                ) : (
                  <button
                    className="flex-1 px-4 py-2 text-sm bg-blue-600 rounded-lg hover:bg-blue-700"
                    onClick={() => navigate(`/dashboard/events/${event._id}`)}
                  >
                    Join Event
                  </button>
                )}
                <button
                  className="flex-1 px-4 py-2 text-sm bg-green-600 rounded-lg hover:bg-green-700"
                  onClick={() => navigate(`/dashboard/events/${event._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventsPage;
