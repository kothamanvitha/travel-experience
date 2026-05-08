"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function Itinerary() {
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const preferences = sessionStorage.getItem("tripPreferences");
    if (!preferences) {
      router.push("/planner");
      return;
    }

    const fetchItinerary = async () => {
      try {
        const response = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: preferences,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to generate itinerary");
        }

        setItinerary(data.itinerary);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [router]);

  return (
    <div className="container" style={{ padding: "3rem 1rem" }}>
      <div className="navbar">
        <div className="logo" onClick={() => router.push("/")} style={{ cursor: "pointer" }}>ExperienceYourTravel</div>
        <button className="btn btn-primary" onClick={() => router.push("/planner")}>Plan Another Trip</button>
      </div>

      <div className="glass-panel animate-fade-in" style={{ padding: "2.5rem", maxWidth: "900px", margin: "0 auto" }}>
        {loading ? (
          <div className="text-center">
            <h2 className="heading-2">Crafting your perfect experience...</h2>
            <p className="text-muted">Our AI is analyzing your preferences to create a custom itinerary.</p>
            {/* Simple CSS Spinner */}
            <div style={{
              border: "4px solid rgba(255, 255, 255, 0.1)",
              borderTop: "4px solid var(--primary)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
              margin: "2rem auto"
            }}></div>
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        ) : error ? (
          <div className="text-center">
            <h2 className="heading-2" style={{ color: "var(--error)" }}>Oops!</h2>
            <p className="text-muted">{error}</p>
            <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown>{itinerary}</ReactMarkdown>
            
            <style jsx global>{`
              .markdown-content h1 { font-size: 2.5rem; margin-bottom: 1.5rem; background: linear-gradient(to right, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
              .markdown-content h2 { font-size: 1.8rem; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
              .markdown-content h3 { font-size: 1.4rem; margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--text-main); }
              .markdown-content p { margin-bottom: 1rem; line-height: 1.6; color: var(--text-muted); }
              .markdown-content ul, .markdown-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--text-muted); }
              .markdown-content li { margin-bottom: 0.5rem; }
              .markdown-content strong { color: var(--text-main); }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
