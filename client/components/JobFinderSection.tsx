import React, { useState } from "react";
import { Search } from "lucide-react";

interface JobListing {
  title: string;
  company: string;
  location: string;
  description: string;
  redirect_url: string;
}

export const JobFinderSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    const trimmedQuery = searchQuery.trim();
    const trimmedLocation = location.trim();

    if (!trimmedQuery || !trimmedLocation) {
      setError("Please enter both job title and location.");
      setJobs([]);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/search?what=${encodeURIComponent(
          trimmedQuery
        )}&where=${encodeURIComponent(trimmedLocation)}`,
        { method: "GET", mode: "cors" }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      const validJobs: JobListing[] = Array.isArray(data.jobs)
        ? data.jobs.filter(
          (job) =>
            job &&
            typeof job.title === "string" &&
            typeof job.company === "string" &&
            typeof job.location === "string" &&
            typeof job.description === "string" &&
            typeof job.redirect_url === "string"
        )
        : [];

      setJobs(validJobs);
      if (validJobs.length === 0) setError("No jobs found for this query.");
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
      setError("Failed to fetch jobs. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex-1 mt-12 md:mt-0">
      <h2 className="font-serif font-bold text-3xl md:text-4xl text-sidebar-foreground mb-6">
        Job Finder
      </h2>

      {/* Search Inputs */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Job title or keyword"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full md:w-1/3 px-4 py-3 rounded-lg border border-border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={fetchJobs}
          disabled={loading}
          className={`px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Job Listings */}
      {loading && !error ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 && !error ? (
        <p>No jobs found. Try searching!</p>
      ) : (
        <div className="space-y-5">
          {jobs.map((job, idx) => (
            <div
              key={job.redirect_url + idx} // fallback unique key
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="font-serif font-bold text-xl text-gray-900 mb-1">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600 font-medium mb-3">
                  {job.company}
                </p>
                <p className="text-sm text-gray-500 mb-4">📍 {job.location}</p>
                <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                  {job.description
                    ? job.description.slice(0, 180) + "..."
                    : "No description available"}
                </p>
                <a
                  href={job.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all text-sm"
                >
                  View Job
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};