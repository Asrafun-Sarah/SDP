"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  Search,
  SlidersHorizontal,
  FolderGit2,
  User,
  ExternalLink,
  ArrowRight,
  Loader2,
} from "lucide-react";

type ProjectOwner = {
  id: number;
  name: string;
  email: string;
  department?: string | null;
  bio?: string | null;
  demonstrated_skills?: string | null;
};

type Project = {
  id: number;
  title: string;
  description: string;
  category: string;
  tech_stack?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  user_id: number;
  created_at: string;
  owner: ProjectOwner;
};

const categories = [
  "All",
  "Web Development",
  "Mobile Development",
  "AI / ML",
  "IoT",
  "Embedded Systems",
  "Robotics",
  "Software",
  "Other",
];

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/projects");

      setProjects(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      project.title.toLowerCase().includes(searchText) ||
      project.description.toLowerCase().includes(searchText) ||
      project.category.toLowerCase().includes(searchText) ||
      (project.tech_stack || "").toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" || project.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main style={{ minHeight: "100vh", paddingBottom: "4rem" }}>
      {/* Hero Section */}
      <section
        style={{
          padding: "4rem 1.5rem 2.5rem",
          background:
            "radial-gradient(circle at top left, rgba(56,189,248,0.12), transparent 35%), radial-gradient(circle at top right, rgba(99,102,241,0.12), transparent 35%)",
        }}
      >
        <div
          className="container"
          style={{
            textAlign: "center",
            maxWidth: "1000px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.45rem 0.8rem",
              borderRadius: "999px",
              background: "rgba(56,189,248,0.1)",
              border: "1px solid rgba(56,189,248,0.2)",
              color: "var(--primary-cyan)",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "1.25rem",
            }}
          >
            <FolderGit2 size={16} />
            Student Project Community
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.15,
              fontWeight: 800,
              marginBottom: "1rem",
            }}
          >
            Discover{" "}
            <span className="gradient-text">Engineering Projects</span>
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: "700px",
              margin: "0 auto",
              fontSize: "1.05rem",
            }}
          >
            Explore projects created by fellow engineering students,
            discover useful technologies, and find projects where you can
            collaborate or ask for help.
          </p>
        </div>
      </section>

      {/* Search + Filter */}
      <section style={{ padding: "1rem 1.5rem 2rem" }}>
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: "1rem",
              borderRadius: "14px",
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: "1 1 300px",
              }}
            >
              <Search
                size={19}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-subtle)",
                }}
              />

              <input
                className="input-field"
                type="text"
                placeholder="Search projects, technologies, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  paddingLeft: "2.8rem",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <SlidersHorizontal
                size={18}
                style={{ color: "var(--primary-cyan)" }}
              />

              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "auto",
                  minWidth: "190px",
                  cursor: "pointer",
                }}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section style={{ padding: "0 1.5rem" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  marginBottom: "0.25rem",
                }}
              >
                Explore Projects
              </h2>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                }}
              >
                {filteredProjects.length} project
                {filteredProjects.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <Link href="/projects" className="btn-secondary">
              View all projects
              <ArrowRight size={17} />
            </Link>
          </div>

          {loading && (
            <div
              style={{
                minHeight: "250px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "var(--text-muted)",
                gap: "0.75rem",
              }}
            >
              <Loader2
                size={24}
                style={{
                  animation: "spin 1s linear infinite",
                }}
              />
              Loading projects...
            </div>
          )}

          {!loading && error && (
            <div
              className="glass-card"
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "#f87171",
              }}
            >
              <p>{error}</p>

              <button
                onClick={loadProjects}
                className="btn-secondary"
                style={{ marginTop: "1rem" }}
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredProjects.length === 0 && (
            <div
              className="glass-card"
              style={{
                padding: "3rem 1.5rem",
                textAlign: "center",
              }}
            >
              <FolderGit2
                size={45}
                style={{
                  color: "var(--text-subtle)",
                  marginBottom: "1rem",
                }}
              />

              <h3
                style={{
                  fontSize: "1.2rem",
                  marginBottom: "0.5rem",
                }}
              >
                No projects found
              </h3>

              <p
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Try changing your search or category filter.
              </p>
            </div>
          )}

          {!loading && !error && filteredProjects.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {filteredProjects.map((project) => (
                <article
                  key={project.id}
                  className="glass-card"
                  style={{
                    padding: "1.4rem",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "330px",
                  }}
                >
                  {/* Category */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.35rem 0.7rem",
                        borderRadius: "999px",
                        background: "rgba(99,102,241,0.12)",
                        border:
                          "1px solid rgba(99,102,241,0.25)",
                        color: "#a5b4fc",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {project.category}
                    </span>

                    <FolderGit2
                      size={20}
                      style={{
                        color: "var(--primary-cyan)",
                      }}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      marginBottom: "0.6rem",
                    }}
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      marginBottom: "1rem",
                    }}
                  >
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  {project.tech_stack && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.4rem",
                        marginBottom: "1.2rem",
                      }}
                    >
                      {project.tech_stack
                        .split(",")
                        .map((tech) => (
                          <span
                            key={tech.trim()}
                            style={{
                              fontSize: "0.72rem",
                              padding: "0.3rem 0.55rem",
                              borderRadius: "5px",
                              background:
                                "rgba(52,211,153,0.08)",
                              color: "#6ee7b7",
                              border:
                                "1px solid rgba(52,211,153,0.15)",
                            }}
                          >
                            {tech.trim()}
                          </span>
                        ))}
                    </div>
                  )}

                  {/* Owner */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.65rem",
                      paddingTop: "0.9rem",
                      borderTop:
                        "1px solid var(--border-color)",
                      marginTop: "auto",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(99,102,241,0.2))",
                        border:
                          "1px solid rgba(56,189,248,0.2)",
                      }}
                    >
                      <User size={17} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        {project.owner?.name || "Unknown student"}
                      </p>

                      {project.owner?.department && (
                        <p
                          style={{
                            color: "var(--text-subtle)",
                            fontSize: "0.72rem",
                          }}
                        >
                          {project.owner.department}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.6rem",
                    }}
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      className="btn-primary"
                      style={{
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      View project
                      <ArrowRight size={16} />
                    </Link>

                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        aria-label="Open GitHub repository"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          select {
            width: 100% !important;
          }
        }
      `}</style>
    </main>
  );
}