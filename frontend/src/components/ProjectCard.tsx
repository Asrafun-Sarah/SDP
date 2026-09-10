"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CategoryBadge } from "./CategoryBadge";
import { User, ArrowRight, Calendar, Lock, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export interface ProjectAuthor {
  id: number;
  full_name?: string;
  name?: string;
  email?: string;
  department?: string;
  bio?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies?: string;
  tech_stack?: string;
  github_link?: string;
  demo_link?: string;
  github_url?: string;
  demo_url?: string;
  author_id?: number;
  author?: ProjectAuthor;
  user_id?: number;
  owner?: ProjectAuthor;
  created_at: string;
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { user, loading } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const techList = (project.technologies || project.tech_stack || "")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);

  const projectOwner = project.owner || project.author;
  
  const authorId = projectOwner?.id ?? project.author_id ?? project.user_id;
  
  const authorName =
  projectOwner?.full_name ||
  projectOwner?.name ||
  "Engineering Student";
  
  const authorDepartment =
  projectOwner?.department ||
  "Engineering Student";

  const handleProtectedClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (!loading && !user) {
      event.preventDefault();
      setShowLoginPrompt(true);
    }
  };

  return (
    <>
      <div
        className="glass-card"
        style={{
          padding: "1.375rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.875rem",
            }}
          >
            <CategoryBadge category={project.category} />

            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-subtle)",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <Calendar size={12} />

              {new Date(project.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "var(--text-main)",
              lineHeight: 1.3,
            }}
          >
            <Link
              href={`/projects/${project.id}`}
              onClick={handleProtectedClick}
            >
              {project.title}
            </Link>
          </h3>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              lineHeight: 1.55,
              marginBottom: "1rem",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {project.description}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.375rem",
              marginBottom: "1.25rem",
            }}
          >
            {techList.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "0.725rem",
                  fontFamily: "var(--font-mono)",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#e5e7eb",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "4px",
                }}
              >
                {tech}
              </span>
            ))}

            {techList.length > 4 && (
              <span
                style={{
                  fontSize: "0.725rem",
                  color: "var(--text-subtle)",
                  alignSelf: "center",
                }}
              >
                +{techList.length - 4} more
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border-color)",
            paddingTop: "0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {authorId ? (
            <Link
              href={`/profile/${authorId}`}
              onClick={handleProtectedClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.825rem",
                color: "var(--text-muted)",
              }}
            >
              <div
                style={{
                  width: "1.6rem",
                  height: "1.6rem",
                  borderRadius: "50%",
                  background: "rgba(56, 189, 248, 0.15)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <User size={11} color="var(--primary-cyan)" />
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 600,
                    color: "var(--text-main)",
                    lineHeight: 1.1,
                  }}
                >
                  {authorName}
                </div>

                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-subtle)",
                  }}
                >
                  {authorDepartment}
                </div>
              </div>
            </Link>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.825rem",
                color: "var(--text-muted)",
              }}
            >
              <div
                style={{
                  width: "1.6rem",
                  height: "1.6rem",
                  borderRadius: "50%",
                  background: "rgba(56, 189, 248, 0.15)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <User size={11} color="var(--primary-cyan)" />
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 600,
                    color: "var(--text-main)",
                    lineHeight: 1.1,
                  }}
                >
                  {authorName}
                </div>

                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-subtle)",
                  }}
                >
                  {authorDepartment}
                </div>
              </div>
            </div>
          )}

          <Link
            href={`/projects/${project.id}`}
            onClick={handleProtectedClick}
            style={{
              fontSize: "0.825rem",
              fontWeight: 600,
              color: "var(--primary-cyan)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            Details
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* LOGIN REQUIRED MODAL */}
      {showLoginPrompt && (
        <div
          onClick={() => setShowLoginPrompt(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            background: "rgba(2, 5, 15, 0.78)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "430px",
              padding: "2rem",
              borderRadius: "22px",
              border: "1px solid rgba(119, 137, 220, 0.25)",
              background:
                "linear-gradient(145deg, #151d3b, #0c1124)",
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
              textAlign: "center",
            }}
          >
            <button
              onClick={() => setShowLoginPrompt(false)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                width: "32px",
                height: "32px",
                border: "none",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.06)",
                color: "#9da6c1",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
              }}
            >
              <X size={17} />
            </button>

            <div
              style={{
                width: "58px",
                height: "58px",
                margin: "0 auto 1.25rem",
                borderRadius: "17px",
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(135deg, rgba(74, 121, 255, 0.2), rgba(126, 85, 232, 0.2))",
                border: "1px solid rgba(113, 137, 255, 0.25)",
              }}
            >
              <Lock size={25} color="#8295ff" />
            </div>

            <h2
              style={{
                margin: "0 0 0.75rem",
                fontSize: "1.45rem",
                color: "#f4f6ff",
              }}
            >
              Login Required
            </h2>

            <p
              style={{
                margin: "0 auto 1.5rem",
                maxWidth: "340px",
                color: "#9ca5c0",
                fontSize: "0.9rem",
                lineHeight: 1.65,
              }}
            >
              Please log in or create an account to view this
              project and connect with engineering students.
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/login"
                style={{
                  padding: "11px 20px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #477cff, #7458e8)",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}
              >
                Log In
              </Link>

              <Link
                href="/register"
                style={{
                  padding: "11px 20px",
                  borderRadius: "10px",
                  border: "1px solid rgba(139, 150, 190, 0.25)",
                  background: "rgba(255, 255, 255, 0.04)",
                  color: "#e8ebff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};