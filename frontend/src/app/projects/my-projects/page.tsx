"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { ProjectCard, Project } from "@/components/ProjectCard";
import { CategoryBadge } from "@/components/CategoryBadge";
import { FolderGit2, PlusCircle, Edit, Trash2, ExternalLink, Eye, X } from "lucide-react";

export default function MyProjectsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editTechnologies, setEditTechnologies] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editDemo, setEditDemo] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadMyProjects();
    }
  }, [user, authLoading, router]);

  const loadMyProjects = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Project[]>("/projects/me");
      setProjects(data);
    } catch (err) {
      console.error("Failed to load my projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (proj: Project) => {
    setEditingProject(proj);
    setEditTitle(proj.title);
    setEditCategory(proj.category);
    setEditTechnologies(proj.technologies);
    setEditDescription(proj.description);
    setEditGithub(proj.github_link || "");
    setEditDemo(proj.demo_link || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      setSavingEdit(true);
      await apiFetch<Project>(`/projects/${editingProject.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editTitle,
          category: editCategory,
          technologies: editTechnologies,
          description: editDescription,
          github_link: editGithub.trim() || undefined,
          demo_link: editDemo.trim() || undefined,
        }),
      });

      setEditingProject(null);
      await loadMyProjects();
    } catch (err: any) {
      alert(err.message || "Failed to update project.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (projectId: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiFetch(`/projects/${projectId}`, {
        method: "DELETE",
      });
      await loadMyProjects();
    } catch (err: any) {
      alert(err.message || "Failed to delete project.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
        Loading my projects...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "3rem 1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>My Uploaded Projects</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            View, edit, and manage your engineering project submissions
          </p>
        </div>

        <Link href="/projects/upload" className="btn-primary">
          <PlusCircle size={16} />
          Upload New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <FolderGit2 size={48} color="var(--text-subtle)" style={{ margin: "0 auto 1rem auto" }} />
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>You haven't uploaded any projects yet</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto 1.5rem auto" }}>
            Sharing your academic or personal builds helps fellow engineering students and builds your demonstrated skill profile.
          </p>
          <Link href="/projects/upload" className="btn-primary">
            <PlusCircle size={16} /> Upload First Project
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
          {projects.map((proj) => (
            <div key={proj.id} className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
                  <CategoryBadge category={proj.category} />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>
                    {new Date(proj.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  {proj.title}
                </h3>

                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.5, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {proj.description}
                </p>

                <div style={{ fontSize: "0.8rem", color: "var(--primary-cyan)", fontFamily: "var(--font-mono)", marginBottom: "1.25rem" }}>
                  Stack: {proj.technologies}
                </div>
              </div>

              {/* Management Controls */}
              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Link href={`/projects/${proj.id}`} className="btn-secondary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>
                  <Eye size={14} /> View
                </Link>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleStartEdit(proj)}
                    className="btn-secondary"
                    style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id, proj.title)}
                    className="btn-outline-danger"
                    style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Project Modal Dialog */}
      {editingProject && (
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
          <div className="glass-card" style={{ width: "100%", maxWidth: "580px", padding: "2rem", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
            <button
              onClick={() => setEditingProject(null)}
              style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "1.25rem" }}>
              Edit Project Details
            </h3>

            <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Project Title</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Category</label>
                <select
                  className="input-field"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                >
                  <option value="Embedded Systems">Embedded Systems</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Software">Software</option>
                  <option value="Mechanical/CAD">Mechanical/CAD</option>
                  <option value="ML/AI">ML/AI</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Technologies (Comma-separated)</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={editTechnologies}
                  onChange={(e) => setEditTechnologies(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Description</label>
                <textarea
                  required
                  rows={4}
                  className="input-field"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>GitHub Link</label>
                <input
                  type="url"
                  className="input-field"
                  value={editGithub}
                  onChange={(e) => setEditGithub(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Demo Link</label>
                <input
                  type="url"
                  className="input-field"
                  value={editDemo}
                  onChange={(e) => setEditDemo(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setEditingProject(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={savingEdit} className="btn-primary">
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
