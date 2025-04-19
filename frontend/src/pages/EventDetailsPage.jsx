import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/events/${eventId}`);
        const data = await res.json();
        if (res.ok) setEvent(data.event);
        else setError("Failed to load event");
      } catch {
        setError("Error fetching event");
      }
    };

    fetchEvent();
  }, [eventId]);

  if (error) {
    return <div className="p-6 text-red-400">{error}</div>;
  }

  if (!event) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 text-gray-200 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {event.image && (
          <img
            src={event.image}
            alt="Event"
            className="object-cover w-full h-64 mb-6 rounded-lg"
          />
        )}
        <h1 className="mb-2 text-4xl font-bold">{event.title}</h1>
        <p className="mb-1 text-gray-400">📍 {event.location}</p>
        <p className="mb-4 text-gray-400">📅 {new Date(event.eventDate).toLocaleDateString()}</p>
        <p className="mb-6">{event.description}</p>

        <button
          className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
          onClick={() => navigate(`/dashboard/events/${event._id}/join`)
          }
        >
          Join This Event
        </button>
      </div>
    </div>
  );
};

export default EventDetailsPage;
