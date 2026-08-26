import React from "react";
import Link from "next/link";
import { CategoryBadge } from "./CategoryBadge";
import { User, ArrowRight, Calendar } from "lucide-react";

export interface ProjectAuthor {
  id: number;
  full_name: string;
  email: string;
  department: string;
  bio?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string;
  github_link?: string;
  demo_link?: string;
  author_id: number;
  author: ProjectAuthor;
  created_at: string;
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const techList = project.technologies
    ? project.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
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
          <Link href={`/projects/${project.id}`}>
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
        <Link
          href={`/profile/${project.author?.id || project.author_id}`}
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
              {project.author?.full_name || "Unknown Author"}
            </div>

            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-subtle)",
              }}
            >
              {project.author?.department || "Engineering Student"}
            </div>
          </div>
        </Link>

        <Link
          href={`/projects/${project.id}`}
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
  );
};
