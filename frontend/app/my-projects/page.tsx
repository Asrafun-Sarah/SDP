"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, Project } from "@/lib/api";
import { FolderGit2, PlusCircle, Trash2, ExternalLink, GitBranch } from "lucide-react";

export default function MyProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  async function fetchMyProjects() {
    try {
      const data = await apiFetch("/api/projects/my-projects");
      setProjects(data);
    } catch (err) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await apiFetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    }
  }

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-sm">Loading your projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <FolderGit2 className="w-7 h-7 text-blue-400" />
            <span>My Projects</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage and view engineering projects uploaded by you</p>
        </div>

        <Link
          href="/projects/new"
          className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors flex items-center gap-1.5 w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload New Project</span>
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800/40 rounded">
                    {proj.category}
                  </span>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-lg text-white">
                  <Link href={`/projects/${proj.id}`} className="hover:text-blue-400 transition-colors">
                    {proj.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{proj.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">Stack: {proj.tech_stack}</span>
                <Link href={`/projects/${proj.id}`} className="text-blue-400 hover:underline font-semibold">
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl text-center space-y-3">
          <p className="text-sm text-slate-400">You haven't uploaded any projects yet.</p>
          <Link href="/projects/new" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:underline">
            <PlusCircle className="w-4 h-4" />
            <span>Upload your first engineering project</span>
          </Link>
        </div>
      )}
    </div>
  );
}
