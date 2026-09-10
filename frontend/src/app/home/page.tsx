"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, ArrowRight, FolderOpen } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface ProjectOwner {
  id: number;
  name?: string;
  full_name?: string;
  department?: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  tech_stack?: string;
  technologies?: string;
  github_url?: string;
  github_link?: string;
  demo_url?: string;
  demo_link?: string;
  user_id?: number;
  author_id?: number;
  owner?: ProjectOwner;
  author?: ProjectOwner;
  created_at?: string;
}

const categories = [
  "All",
  "Embedded Systems",
  "Software",
  "Electronics",
  "Robotics",
  "IoT",
  "Other",
];

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch<Project[]>("/projects");

      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError("Unable to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      project.title.toLowerCase().includes(searchText) ||
      project.description.toLowerCase().includes(searchText) ||
      (project.tech_stack || project.technologies || "")
        .toLowerCase()
        .includes(searchText);

    const matchesCategory =
      category === "All" || project.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main
      className="container"
      style={{
        paddingTop: "2.5rem",
        paddingBottom: "4rem",
      }}
    >
      {/* Header */}
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "2rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              color: "var(--primary-cyan)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              marginBottom: "0.5rem",
            }}
          >
            PROJECTFORGE / DISCOVER
          </p>

          <h1
            style={{
              fontSize: "2.4rem",
              fontWeight: 800,
              marginBottom: "0.6rem",
            }}
          >
            Engineering{" "}
            <span className="gradient-text">Projects</span>
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: "650px",
              fontSize: "1rem",
            }}
          >
            Explore projects shared by engineering students and discover
            ideas, technologies, and potential collaborators.
          </p>
        </div>

        <Link href="/projects/upload" className="btn-primary">
          Upload Project
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Search */}
      <section
        className="glass-panel"
        style={{
          padding: "1rem",
          borderRadius: "12px",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: "250px",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-subtle)",
              }}
            />

            <input
              type="text"
              placeholder="Search projects, technologies, or topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: "2.8rem" }}
            />
          </div>
        </div>

        {/* Categories */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginTop: "1rem",
          }}
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={
                category === item ? "btn-primary" : "btn-secondary"
              }
              style={{
                padding: "0.45rem 0.85rem",
                fontSize: "0.82rem",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 1rem",
            color: "var(--text-muted)",
          }}
        >
          Loading projects...
        </div>
      ) : error ? (
        <div
          className="glass-card"
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "#f87171",
          }}
        >
          {error}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: "4rem 1rem",
            textAlign: "center",
          }}
        >
          <FolderOpen
            size={42}
            style={{
              color: "var(--text-subtle)",
              marginBottom: "1rem",
            }}
          />

          <h2 style={{ marginBottom: "0.5rem" }}>
            No projects found
          </h2>

          <p style={{ color: "var(--text-muted)" }}>
            Try a different search or category.
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"} found
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {filteredProjects.map((project) => {
              const techList = (
                project.tech_stack ||
                project.technologies ||
                ""
              )
                .split(",")
                .map((tech) => tech.trim())
                .filter(Boolean);

              const owner = project.owner || project.author;

              const ownerName =
                owner?.name ||
                owner?.full_name ||
                "Engineering Student";

              const githubLink =
                project.github_url || project.github_link;

              return (
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
                  <div style={{ marginBottom: "0.8rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.3rem 0.65rem",
                        borderRadius: "999px",
                        background:
                          "rgba(56, 189, 248, 0.1)",
                        border:
                          "1px solid rgba(56, 189, 248, 0.2)",
                        color: "var(--primary-cyan)",
                        fontSize: "0.72rem",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {project.category || "Engineering"}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      marginBottom: "0.7rem",
                      lineHeight: 1.35,
                    }}
                  >
                    {project.title}
                  </h2>

                  {/* Description */}
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      marginBottom: "1rem",
                    }}
                  >
                    {project.description}
                  </p>

                  {/* Technologies */}
                  {techList.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.4rem",
                        flexWrap: "wrap",
                        marginBottom: "1rem",
                      }}
                    >
                      {techList.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "5px",
                            background:
                              "rgba(255, 255, 255, 0.05)",
                            border:
                              "1px solid var(--border-color)",
                            color: "var(--text-muted)",
                            fontSize: "0.72rem",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Owner */}
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "1rem",
                      borderTop:
                        "1px solid var(--border-color)",
                      marginBottom: "1rem",
                    }}
                  >
                    <p
                      style={{
                        color: "var(--text-subtle)",
                        fontSize: "0.72rem",
                        marginBottom: "0.2rem",
                      }}
                    >
                      Posted by
                    </p>

                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      {ownerName}
                    </p>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.6rem",
                      alignItems: "center",
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
                      View Project
                      <ArrowRight size={14} />
                    </Link>

                    {githubLink && (
                      <a
                        href={githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        title="View GitHub repository"
                        style={{
                          padding: "0.625rem 0.8rem",
                        }}
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}