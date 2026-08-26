"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Project } from "@/components/ProjectCard";
import {
  FolderGit2,
  ExternalLink,
  User,
  HelpCircle,
  ArrowLeft,
  Calendar,
  Code2,
  CheckCircle,
  X,
  Send
} from "lucide-react";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const projectId = params.id;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Help Request Modal State (Feature 13)
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpMessage, setHelpMessage] = useState("");
  const [submittingHelp, setSubmittingHelp] = useState(false);
  const [helpSuccess, setHelpSuccess] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const data = await apiFetch<Project>(`/projects/${projectId}`);
        setProject(data);
      } catch (err: any) {
        setError(err.message || "Failed to load project details.");
      } finally {
        setLoading(false);
      }
    }
    if (projectId) fetchDetails();
  }, [projectId]);

  const handleSendHelpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setSubmittingHelp(true);
      await apiFetch("/requests", {
        method: "POST",
        body: JSON.stringify({
          project_id: Number(projectId),
          message: helpMessage,
        }),
      });
      setHelpSuccess(true);
      setTimeout(() => {
        setShowHelpModal(false);
        setHelpSuccess(false);
        setHelpMessage("");
      }, 2000);
    } catch (err: any) {
      alert(err.message || "Failed to send help request");
    } finally {
      setSubmittingHelp(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "5rem 1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
        Loading project details...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container" style={{ padding: "5rem 1.5rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>Project Not Found</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>{error}</p>
        <Link href="/projects" className="btn-secondary">
          <ArrowLeft size={16} /> Back to Browse Projects
        </Link>
      </div>
    );
  }

  const techList = project.technologies
    ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const isOwnProject = user && user.id === project.author_id;

  return (
    <div className="container" style={{ padding: "3rem 1.5rem", maxWidth: "1000px" }}>
      {/* Back Button */}
      <Link href="/projects" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem" }}>
        {/* Main Content Area */}
        <div>
          <div className="glass-card" style={{ padding: "2.25rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <CategoryBadge category={project.category} />
              <span style={{ fontSize: "0.8rem", color: "var(--text-subtle)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Calendar size={13} />
                Published {new Date(project.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>

            <h1 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "1.25rem", lineHeight: 1.2 }}>
              {project.title}
            </h1>

            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Code2 size={18} color="var(--primary-cyan)" />
                Technologies & Tools Used
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {techList.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-mono)",
                      background: "rgba(56, 189, 248, 0.1)",
                      border: "1px solid rgba(56, 189, 248, 0.25)",
                      color: "var(--primary-cyan)",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "6px",
                      fontWeight: 500
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>Project Overview</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {project.description}
              </p>
            </div>

            {/* External Links */}
            {(project.github_link || project.demo_link) && (
              <div style={{ borderTop: "1px solid var(--border-color)", marginTop: "2rem", paddingTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{ fontSize: "0.875rem" }}
                  >
                    <FolderGit2 size={16} />
                    GitHub Repository
                  </a>
                )}
                {project.demo_link && (
                  <a
                    href={project.demo_link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{ fontSize: "0.875rem" }}
                  >
                    <ExternalLink size={16} />
                    Live Project Demo
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Author Info & Request Help Action */}
        <div>
          <div className="glass-card" style={{ padding: "1.75rem", position: "sticky", top: "5.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Project Author
            </h3>

            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.25rem" }}>
              <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={20} color="#ffffff" />
              </div>
              <div>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{project.author.full_name}</h4>
                <p style={{ fontSize: "0.825rem", color: "var(--primary-cyan)" }}>{project.author.department}</p>
              </div>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              {project.author.bio || "Engineering student sharing technical academic builds and research."}
            </p>

            <Link
              href={`/profile/${project.author.id}`}
              className="btn-secondary"
              style={{ width: "100%", justifyContent: "center", marginBottom: "1rem", fontSize: "0.875rem" }}
            >
              View Student Profile & Skills
            </Link>

            {/* Request Help Button (Feature 13) */}
            {!isOwnProject && (
              <button
                onClick={() => {
                  if (!user) {
                    router.push("/login");
                  } else {
                    setShowHelpModal(true);
                  }
                }}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}
              >
                <HelpCircle size={18} />
                Request Help From Author
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feature 13: Request Help Modal Dialog */}
      {showHelpModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(4px)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem"
        }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "500px", padding: "2rem", position: "relative" }}>
            <button
              onClick={() => setShowHelpModal(false)}
              style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
            >
              <X size={20} />
            </button>

            {helpSuccess ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <CheckCircle size={48} color="#34d399" style={{ margin: "0 auto 1rem auto" }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Request Sent Successfully!</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Your request has been delivered to {project.author.full_name}. You can track the status in your Dashboard.
                </p>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                  Request Help from {project.author.full_name}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
                  Send a friendly message describing what guidance or advice you need regarding "{project.title}".
                </p>

                <form onSubmit={handleSendHelpRequest} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <textarea
                    required
                    rows={4}
                    className="input-field"
                    placeholder="e.g. Hi! I am working on a similar Arduino project for my 2nd year lab and would love your advice on microcontroller wiring and motor driver calibration..."
                    value={helpMessage}
                    onChange={(e) => setHelpMessage(e.target.value)}
                  />

                  <button
                    type="submit"
                    disabled={submittingHelp}
                    className="btn-primary"
                    style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}
                  >
                    <Send size={16} />
                    {submittingHelp ? "Sending Request..." : "Send Help Request"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
