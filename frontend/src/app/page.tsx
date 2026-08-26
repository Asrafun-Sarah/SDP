"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { ProjectCard, Project } from "@/components/ProjectCard";
import { Cpu, Search, PlusCircle, Users, Sparkles, ArrowRight, ShieldCheck, BookOpen, Layers } from "lucide-react";

export default function LandingPage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await apiFetch<Project[]>("/projects");
        setFeaturedProjects(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load featured projects:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: "5rem 0 4rem 0", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none"
        }} />

        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(56, 189, 248, 0.1)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            color: "var(--primary-cyan)",
            padding: "0.375rem 1rem",
            borderRadius: "9999px",
            fontSize: "0.85rem",
            fontWeight: 600,
            marginBottom: "1.5rem"
          }}>
            <Sparkles size={14} />
            Designed Exclusively for Engineering Students
          </div>

          <h1 style={{ fontSize: "3.25rem", fontWeight: 800, lineHeight: 1.15, marginBottom: "1.25rem", letterSpacing: "-0.03em" }}>
            Share, Explore & Learn From <br />
            <span className="gradient-text">Real Student Engineering Projects</span>
          </h1>

          <p style={{ color: "var(--text-muted)", fontSize: "1.125rem", maxWidth: "720px", margin: "0 auto 2.5rem auto", lineHeight: 1.6 }}>
            Overcome project block. Discover previous academic and personal engineering builds, inspect exact technologies used (Arduino, ROS 2, C++, ML), showcase your demonstrated skills, and request peer guidance.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/projects" className="btn-primary" style={{ padding: "0.875rem 1.75rem", fontSize: "1rem" }}>
              <Search size={18} />
              Browse All Projects
            </Link>
            <Link href="/register" className="btn-secondary" style={{ padding: "0.875rem 1.75rem", fontSize: "1rem" }}>
              Sign Up Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ padding: "3rem 0", background: "rgba(17, 24, 39, 0.3)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Why ProjectForge?</h2>
            <p style={{ color: "var(--text-muted)" }}>Solving real challenges faced by engineering students every semester</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div className="glass-card" style={{ padding: "1.75rem" }}>
              <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "10px", background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <BookOpen size={22} color="var(--primary-cyan)" />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>Centralized Discovery</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.55 }}>
                Search previous student projects by topic, course, or keyword. Stop starting from scratch.
              </p>
            </div>

            <div className="glass-card" style={{ padding: "1.75rem" }}>
              <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "10px", background: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Layers size={22} color="#c084fc" />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>Demonstrated Experience</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.55 }}>
                Skills are computed directly from your uploaded builds (e.g. C++ — 3 projects, Arduino — 2 projects) rather than self-ratings.
              </p>
            </div>

            <div className="glass-card" style={{ padding: "1.75rem" }}>
              <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "10px", background: "rgba(52, 211, 153, 0.15)", border: "1px solid rgba(52, 211, 153, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Users size={22} color="#34d399" />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>Peer Guidance Requests</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.55 }}>
                Send simple help requests directly to experienced students who built similar projects to request advice or assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Featured Student Builds</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Explore high-impact projects recently shared by engineering peers</p>
            </div>
            <Link href="/projects" className="btn-secondary" style={{ fontSize: "0.875rem" }}>
              View All Projects
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-muted)" }}>
              Loading engineering projects...
            </div>
          ) : featuredProjects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-muted)" }}>
              No projects uploaded yet. Be the first student to submit a project!
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
