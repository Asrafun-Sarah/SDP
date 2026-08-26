"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { ProjectCard, Project } from "@/components/ProjectCard";
import { Search, Filter, Layers, RefreshCw } from "lucide-react";

const CATEGORIES = [
  "All",
  "Embedded Systems",
  "Robotics",
  "Software",
  "Mechanical/CAD",
  "ML/AI",
  "Electrical"
];

function ProjectsBrowseContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [projects, setProjects] = useState<Project[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const fetchProjects = async (searchOverride?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedCategory && selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }

      const kw = searchOverride !== undefined ? searchOverride : searchKeyword;
      if (kw.trim()) {
        params.append("search", kw.trim());
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const data = await apiFetch<Project[]>(`/projects${queryString}`);
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
  };

  return (
    <div>
      {/* Feature 6 & Feature 7 Controls Bar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {/* Search Bar (Feature 6) */}
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "0.75rem", maxWidth: "680px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: "2.75rem" }}
              placeholder="Search by keywords, project titles, or technologies (e.g. Arduino, ROS 2, PyTorch)..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {/* Category Filters (Feature 7) */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem", marginRight: "0.5rem" }}>
            <Filter size={15} />
            Categories:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                style={{
                  background: isSelected ? "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)" : "rgba(255, 255, 255, 0.05)",
                  color: isSelected ? "#ffffff" : "var(--text-muted)",
                  border: isSelected ? "none" : "1px solid var(--border-color)",
                  padding: "0.4rem 0.875rem",
                  borderRadius: "9999px",
                  fontSize: "0.825rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid (Feature 5) */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 1rem auto" }} />
          Loading engineering projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
          <Layers size={40} color="var(--text-subtle)" style={{ margin: "0 auto 1rem auto" }} />
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>No matching projects found</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto 1.5rem auto" }}>
            Try searching for a different keyword or select another engineering category filter.
          </p>
          <button
            onClick={() => {
              setSearchKeyword("");
              setSelectedCategory("All");
            }}
            className="btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectsBrowsePage() {
  return (
    <div className="container" style={{ padding: "3rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800 }}>Browse Engineering Projects</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
          Discover academic and personal projects created by engineering students across disciplines
        </p>
      </div>

      <Suspense fallback={<div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-muted)" }}>Loading projects page...</div>}>
        <ProjectsBrowseContent />
      </Suspense>
    </div>
  );
}
