"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { PlusCircle, Code, FolderGit2, ExternalLink, AlertCircle } from "lucide-react";

const CATEGORIES = [
  "Embedded Systems",
  "Robotics",
  "Software",
  "Mechanical/CAD",
  "ML/AI",
  "Electrical"
];

export default function UploadProjectPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Embedded Systems");
  const [technologies, setTechnologies] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await apiFetch<any>("/projects", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          category,
          technologies,
          github_link: githubLink.trim() || undefined,
          demo_link: demoLink.trim() || undefined,
        }),
      });

      router.push(`/projects/${res.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to submit project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="container" style={{ padding: "4rem 1.5rem", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>;
  }

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", maxWidth: "680px" }}>
      <div className="glass-card" style={{ padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem auto"
          }}>
            <PlusCircle size={24} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 800 }}>Upload Engineering Project</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Share your academic build or personal project with fellow engineering students
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(244, 63, 94, 0.12)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            color: "#fb7185",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem"
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.4rem" }}>
              Project Title *
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. Autonomous Obstacle Avoidance Rover with ROS 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.4rem" }}>
              Engineering Category *
            </label>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.4rem" }}>
              Technologies & Tools Used * (Comma-separated)
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. C++, Arduino, ROS 2, OpenCV, SolidWorks"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginTop: "0.25rem", display: "block" }}>
              These technologies will build your demonstrated experience profile automatically!
            </span>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.4rem" }}>
              Project Description *
            </label>
            <textarea
              required
              rows={6}
              className="input-field"
              placeholder="Describe what your project does, hardware/software architecture, challenges solved, and key results..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.4rem" }}>
              GitHub Repository Link (Optional)
            </label>
            <input
              type="url"
              className="input-field"
              placeholder="https://github.com/username/project-repo"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.4rem" }}>
              Live Demo / Video Link (Optional)
            </label>
            <input
              type="url"
              className="input-field"
              placeholder="https://youtube.com/watch?v=..."
              value={demoLink}
              onChange={(e) => setDemoLink(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "0.75rem", marginTop: "0.5rem" }}
          >
            {submitting ? "Publishing Project..." : "Publish Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
