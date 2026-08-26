"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, Project } from "@/lib/api";
import { Rocket, Search, PlusCircle, GitBranch, ExternalLink } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Embedded Systems", "Robotics", "Software", "CAD/Mechanical", "ML/AI"];

  useEffect(() => {
    fetchProjects();
  }, [category]);

  async function fetchProjects() {
    setLoading(true);
    try {
      let url = `/api/projects?category=${encodeURIComponent(category)}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const data = await apiFetch(url);
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchProjects();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Rocket className="w-8 h-8 text-cyan-400" />
            <span>Engineering Project Repository</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Explore open-source hardware and software projects created by students</p>
        </div>
        <Link
          href="/projects/new"
          className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-opacity flex items-center gap-2 text-sm w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Project</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects or tech stack..."
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading projects...</div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/40 rounded-full">
                    {proj.category}
                  </span>
                  <span className="text-xs text-slate-500">by {proj.owner?.name}</span>
                </div>
                <h3 className="font-bold text-lg text-white">{proj.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{proj.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="text-xs text-slate-400 font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-sans">Stack:</span> {proj.tech_stack}
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  {proj.github_url ? (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-slate-300 hover:text-white font-medium"
                    >
                      <GitBranch className="w-4 h-4" />
                      <span>Code Repository</span>
                    </a>
                  ) : (
                    <span className="text-slate-600">No Repo Link</span>
                  )}
                  {proj.demo_url && (
                    <a
                      href={proj.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-cyan-400 hover:underline font-semibold"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 rounded-3xl text-center space-y-3">
          <p className="text-slate-400">No projects found for the selected category or search term.</p>
        </div>
      )}
    </div>
  );
}
