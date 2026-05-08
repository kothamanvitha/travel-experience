"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Planner() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    companions: "Family",
    experience: "Adventurous",
    transportation: "Flight",
    stayPreference: "Hotel",
    foodPreference: "Local Cuisine",
    budget: "Medium",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Store preferences in sessionStorage to pass them to the results page easily
    sessionStorage.setItem("tripPreferences", JSON.stringify(formData));
    
    // Redirect to the itinerary generation page
    router.push("/itinerary");
  };

  return (
    <div className="container" style={{ padding: "3rem 1rem" }}>
      <div className="navbar">
        <div className="logo">ExperienceYourTravel</div>
      </div>
      
      <div className="glass-panel animate-fade-in" style={{ padding: "2.5rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1 className="heading-2 text-center mb-8">Plan Your Next Experience</h1>
        
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "1fr 1fr" }}>
          <div className="input-group" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="destination">Destination</label>
            <input required type="text" id="destination" name="destination" className="input-field" placeholder="E.g. Kyoto, Japan" value={formData.destination} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label htmlFor="startDate">Start Date</label>
            <input required type="date" id="startDate" name="startDate" className="input-field" value={formData.startDate} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label htmlFor="endDate">End Date</label>
            <input required type="date" id="endDate" name="endDate" className="input-field" value={formData.endDate} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label htmlFor="companions">Who are you traveling with?</label>
            <select id="companions" name="companions" className="input-field select-field" value={formData.companions} onChange={handleChange}>
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
              <option value="Couple">Couple</option>
              <option value="Colleagues">Colleagues</option>
              <option value="Solo">Solo</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="experience">What kind of experience?</label>
            <select id="experience" name="experience" className="input-field select-field" value={formData.experience} onChange={handleChange}>
              <option value="Adventurous">Adventurous</option>
              <option value="Calm/Relaxing">Calm / Relaxing</option>
              <option value="Cultural">Cultural</option>
              <option value="Party">Party / Nightlife</option>
              <option value="Nature">Nature / Wildlife</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="transportation">Preferred Transportation</label>
            <select id="transportation" name="transportation" className="input-field select-field" value={formData.transportation} onChange={handleChange}>
              <option value="Flight">Flight</option>
              <option value="Train">Train</option>
              <option value="Bus">Bus</option>
              <option value="Car">Car</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="stayPreference">Stay Preference</label>
            <select id="stayPreference" name="stayPreference" className="input-field select-field" value={formData.stayPreference} onChange={handleChange}>
              <option value="Hotel">Hotel</option>
              <option value="Resort">Resort</option>
              <option value="Hostel">Hostel</option>
              <option value="Airbnb/Rental">Airbnb / Rental</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="foodPreference">Food Preferences</label>
            <input required type="text" id="foodPreference" name="foodPreference" className="input-field" placeholder="E.g. Local Cuisine, Vegan, Seafood" value={formData.foodPreference} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label htmlFor="budget">Budget</label>
            <select id="budget" name="budget" className="input-field select-field" value={formData.budget} onChange={handleChange}>
              <option value="Budget">Budget Friendly</option>
              <option value="Medium">Medium</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "1rem", fontSize: "1.1rem" }} disabled={loading}>
              {loading ? "Generating Experience..." : "Generate Itinerary with AI"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
