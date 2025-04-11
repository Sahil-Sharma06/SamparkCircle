import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaHandHoldingHeart, FaCalendarAlt, FaSearch, FaArrowRight, FaComments } from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();
  const [trendingEvents, setTrendingEvents] = useState([
    {
      id: 1,
      title: "Beach Cleanup Drive",
      ngo: "EcoWarriors Foundation",
      date: "April 20, 2025",
      location: "Mumbai Coastline",
      image: "/api/placeholder/500/300",
      category: "Environment"
    },
    {
      id: 2,
      title: "Educational Workshop for Children",
      ngo: "Bright Future NGO",
      date: "April 25, 2025",
      location: "Delhi",
      image: "/api/placeholder/500/300",
      category: "Education"
    },
    {
      id: 3,
      title: "Animal Shelter Volunteer Day",
      ngo: "Paws & Care",
      date: "May 2, 2025",
      location: "Bangalore",
      image: "/api/placeholder/500/300",
      category: "Animal Welfare"
    }
  ]);

  const [activeFundraisers, setActiveFundraisers] = useState([
    {
      id: 1,
      title: "Support Rural Education",
      ngo: "Education For All",
      goal: 500000,
      raised: 325000,
      image: "/api/placeholder/500/300",
      category: "Education"
    },
    {
      id: 2,
      title: "Clean Water Initiative",
      ngo: "WaterLife Foundation",
      goal: 300000,
      raised: 198000,
      image: "/api/placeholder/500/300",
      category: "Health"
    },
    {
      id: 3,
      title: "Disaster Relief Fund",
      ngo: "Helping Hands",
      goal: 1000000,
      raised: 780000,
      image: "/api/placeholder/500/300",
      category: "Relief"
    }
  ]);

  const [featuredNGOs, setFeaturedNGOs] = useState([
    {
      id: 1,
      name: "Green Earth Initiative",
      category: "Environment",
      image: "/api/placeholder/400/400",
      verified: true
    },
    {
      id: 2,
      name: "Humanity First",
      category: "Humanitarian",
      image: "/api/placeholder/400/400",
      verified: true
    },
    {
      id: 3,
      name: "Children's Hope",
      category: "Child Welfare",
      image: "/api/placeholder/400/400",
      verified: true
    },
    {
      id: 4,
      name: "Elderly Care Foundation",
      category: "Senior Welfare",
      image: "/api/placeholder/400/400",
      verified: true
    }
  ]);

  const [showChat, setShowChat] = useState(false);

  const causeCategories = [
    { name: "Education", icon: "🎓" },
    { name: "Health", icon: "🏥" },
    { name: "Environment", icon: "🌱" },
    { name: "Animal Welfare", icon: "🐾" },
    { name: "Poverty", icon: "🏠" },
    { name: "Disaster Relief", icon: "🆘" },
  ];

  return (
    <div className="min-h-screen text-gray-200 bg-gray-900">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-screen overflow-hidden">
        <div className="absolute inset-0 z-10 bg-black opacity-60"></div>
        <div 
          className="absolute inset-0 z-0 bg-center bg-cover" 
          style={{ 
            backgroundImage: "url('/api/placeholder/1920/1080')", 
            filter: "blur(3px)" 
          }}
        ></div>
        
        <div className="container z-20 px-4 mx-auto text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            Connect. <span className="text-indigo-400">Contribute.</span> Change.
          </h1>
          <p className="max-w-3xl mx-auto mb-10 text-xl md:text-2xl">
            SamparkCircle brings together NGOs, volunteers, and donors to create meaningful social impact.
          </p>
          
          <div className="flex flex-col justify-center gap-4 md:flex-row">
            <button 
              onClick={() => navigate("/register")}
              className="px-8 py-4 text-lg font-medium transition duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Join SamparkCircle
            </button>
            <button 
              onClick={() => navigate("/about")}
              className="px-8 py-4 text-lg font-medium transition duration-300 bg-gray-800 rounded-lg hover:bg-gray-700"
            >
              Learn More
            </button>
          </div>
          
          <div className="flex justify-center gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold">500+</div>
              <div className="text-gray-400">Verified NGOs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">10k+</div>
              <div className="text-gray-400">Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">₹25M+</div>
              <div className="text-gray-400">Donations Raised</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-800">
        <div className="container px-4 mx-auto">
          <h2 className="mb-16 text-3xl font-bold text-center md:text-4xl">How SamparkCircle Works</h2>
          
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-20 h-20 mb-6 bg-indigo-900 rounded-full">
                <FaUsers className="text-3xl text-indigo-400" />
              </div>
              <h3 className="mb-4 text-xl font-semibold">For NGOs</h3>
              <p className="text-gray-400">Create campaigns, post events, and connect with volunteers and donors passionate about your cause.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-20 h-20 mb-6 bg-indigo-900 rounded-full">
                <FaCalendarAlt className="text-3xl text-indigo-400" />
              </div>
              <h3 className="mb-4 text-xl font-semibold">For Volunteers</h3>
              <p className="text-gray-400">Discover meaningful opportunities to contribute your skills and time to causes that matter to you.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-20 h-20 mb-6 bg-indigo-900 rounded-full">
                <FaHandHoldingHeart className="text-3xl text-indigo-400" />
              </div>
              <h3 className="mb-4 text-xl font-semibold">For Donors</h3>
              <p className="text-gray-400">Support verified campaigns and track the impact of your contributions with transparent reporting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore By Cause Section */}
      <section className="py-20 bg-gray-900">
        <div className="container px-4 mx-auto">
          <h2 className="mb-16 text-3xl font-bold text-center md:text-4xl">Explore By Cause</h2>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {causeCategories.map((category, index) => (
              <div 
                key={index}
                onClick={() => navigate(`/causes/${category.name.toLowerCase()}`)}
                className="flex flex-col items-center p-6 text-center transition duration-300 bg-gray-800 cursor-pointer rounded-xl hover:bg-gray-700"
              >
                <div className="mb-3 text-4xl">{category.icon}</div>
                <h3 className="text-lg font-medium">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Events Section */}
      <section className="py-20 bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">Trending Events</h2>
            <button 
              onClick={() => navigate("/events")}
              className="flex items-center text-indigo-400 hover:text-indigo-300"
            >
              View All <FaArrowRight className="ml-2" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {trendingEvents.map(event => (
              <div 
                key={event.id}
                className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition duration-300"
              >
                <img src={event.image} alt={event.title} className="object-cover w-full h-48" />
                <div className="p-6">
                  <div className="mb-2 text-xs font-medium text-indigo-400">{event.category}</div>
                  <h3 className="mb-2 text-xl font-semibold">{event.title}</h3>
                  <p className="mb-4 text-sm text-gray-400">By {event.ngo}</p>
                  
                  <div className="flex justify-between text-sm text-gray-400">
                    <div>{event.date}</div>
                    <div>{event.location}</div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="w-full py-3 mt-6 transition duration-300 bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Fundraisers Section */}
      <section className="py-20 bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">Active Fundraisers</h2>
            <button 
              onClick={() => navigate("/fundraisers")}
              className="flex items-center text-indigo-400 hover:text-indigo-300"
            >
              View All <FaArrowRight className="ml-2" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {activeFundraisers.map(fundraiser => (
              <div 
                key={fundraiser.id}
                className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition duration-300"
              >
                <img src={fundraiser.image} alt={fundraiser.title} className="object-cover w-full h-48" />
                <div className="p-6">
                  <div className="mb-2 text-xs font-medium text-indigo-400">{fundraiser.category}</div>
                  <h3 className="mb-2 text-xl font-semibold">{fundraiser.title}</h3>
                  <p className="mb-4 text-sm text-gray-400">By {fundraiser.ngo}</p>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${(fundraiser.raised / fundraiser.goal) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="text-indigo-400">₹{fundraiser.raised.toLocaleString()}</div>
                    <div className="text-gray-400">of ₹{fundraiser.goal.toLocaleString()}</div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/fundraisers/${fundraiser.id}`)}
                    className="w-full py-3 mt-6 transition duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    Donate Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured NGOs Section */}
      <section className="py-20 bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">Featured NGOs</h2>
            <button 
              onClick={() => navigate("/ngos")}
              className="flex items-center text-indigo-400 hover:text-indigo-300"
            >
              View All <FaArrowRight className="ml-2" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredNGOs.map(ngo => (
              <div 
                key={ngo.id}
                className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition duration-300"
              >
                <img src={ngo.image} alt={ngo.name} className="object-cover w-full h-48" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{ngo.name}</h3>
                    {ngo.verified && (
                      <div className="px-2 py-1 text-xs text-green-400 bg-green-900 rounded">Verified</div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{ngo.category}</p>
                  
                  <button 
                    onClick={() => navigate(`/ngos/${ngo.id}`)}
                    className="w-full py-2 mt-4 text-sm transition duration-300 bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gray-900">
        <div className="container px-4 mx-auto">
          <h2 className="mb-16 text-3xl font-bold text-center md:text-4xl">Impact Stories</h2>
          
          <div className="max-w-3xl p-8 mx-auto bg-gray-800 rounded-xl md:p-10">
            <div className="mb-4 text-6xl text-indigo-400">"</div>
            <p className="mb-8 text-xl italic">
              Through SamparkCircle, we were able to connect with over 200 volunteers for our literacy campaign and raise funds that exceeded our target by 40%. The platform's transparency and ease of use made a significant difference in our outreach efforts.
            </p>
            <div className="flex items-center">
              <img src="/api/placeholder/80/80" alt="Testimonial" className="w-12 h-12 mr-4 rounded-full" />
              <div>
                <div className="font-medium">Priya Sharma</div>
                <div className="text-sm text-gray-400">Director, Education For All</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-indigo-900">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to Make a Difference?</h2>
          <p className="max-w-2xl mx-auto mb-10 text-xl">
            Join SamparkCircle today and be part of a community dedicated to creating positive social change.
          </p>
          
          <div className="flex flex-col justify-center gap-4 md:flex-row">
            <button 
              onClick={() => navigate("/register")}
              className="px-8 py-4 text-lg font-medium text-indigo-900 transition duration-300 bg-white rounded-lg hover:bg-gray-200"
            >
              Create Account
            </button>
            <button 
              onClick={() => navigate("/contact")}
              className="px-8 py-4 text-lg font-medium transition duration-300 bg-transparent border-2 border-white rounded-lg hover:bg-indigo-800"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* AI Chat Assistant */}
      <div className="fixed z-50 bottom-6 right-6">
        {showChat ? (
          <div className="overflow-hidden bg-gray-800 shadow-xl rounded-xl w-80">
            <div className="flex items-center justify-between p-4 bg-indigo-900">
              <div className="font-medium">SamparkCircle Assistant</div>
              <button 
                onClick={() => setShowChat(false)}
                className="text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-80">
              <div className="bg-gray-700 p-3 rounded-lg mb-3 max-w-[80%]">
                How can I help you today?
              </div>
            </div>
            <div className="p-4 border-t border-gray-700">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask me anything..."
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
                />
                <button className="absolute text-indigo-400 right-2 top-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowChat(true)}
            className="flex items-center justify-center transition duration-300 bg-indigo-600 rounded-full shadow-lg w-14 h-14 hover:bg-indigo-700"
          >
            <FaComments className="text-2xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;