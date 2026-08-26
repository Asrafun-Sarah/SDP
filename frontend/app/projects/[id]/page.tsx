"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, Project } from "@/lib/api";
import { Rocket, GitBranch, ExternalLink, User, Calendar, HelpCircle, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Request help modal
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpTitle, setHelpTitle] = useState("");
  const [helpDesc, setHelpDesc] = useState("");
  const [helpSubmitting, setHelpSubmitting] = useState(false);
  const [helpSuccess, setHelpSuccess] = useState("");

  useEffect(() => {
    fetchProjectDetails();
  }, [resolvedParams.id]);

  async function fetchProjectDetails() {
    try {
      const data = await apiFetch(`/api/projects/${resolvedParams.id}`);
      setProject(data);
    } catch (err: any) {
      setError(err.message || "Project not found");
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestHelp(e: React.FormEvent) {
    e.preventDefault();
    setHelpSubmitting(true);
    setHelpSuccess("");
    try {
      await apiFetch("/api/help-requests", {
        method: "POST",
        body: JSON.stringify({
          title: helpTitle,
          description: helpDesc,
          category: project?.category || "General",
          project_id: project?.id,
        }),
      });
      setHelpSuccess("Help request submitted successfully! Mentors will review it on the Help Board.");
      setTimeout(() => {
        setShowHelpModal(false);
        setHelpTitle("");
        setHelpDesc("");
        setHelpSuccess("");
      }, 1500);
    } catch (err: any) {
      alert(err.message || "Failed to submit help request. Please log in.");
    } finally {
      setHelpSubmitting(false);
    }
  }

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-sm">Loading project details...</div>;
  }

  if (error || !project) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-sm">
          {error || "Project not found"}
        </div>
        <Link href="/projects" className="text-xs text-blue-400 hover:underline">← Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6 shadow-sm">
        {/* Category & Date Header */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 text-xs font-semibold bg-blue-950 text-blue-400 border border-blue-800/40 rounded-md">
            {project.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{project.title}</h1>

        {/* Author Info */}
        <div className="flex items-center gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-xs">
          <div className="p-2 bg-blue-950 text-blue-400 rounded-lg">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-white">{project.owner?.name}</div>
            <div className="text-slate-400">{project.owner?.department} • {project.owner?.email}</div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-slate-400">Technologies & Tools Used</div>
          <div className="font-mono text-xs text-blue-300 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
            {project.tech_stack}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400">Project Overview & Documentation</div>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
            {project.description}
          </p>
        </div>

        {/* Links & Help Request CTA */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                <GitBranch className="w-4 h-4 text-blue-400" />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <button
            onClick={() => setShowHelpModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Request Help on this Project</span>
          </button>
        </div>
      </div>

      {/* Help Request Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-lg w-full p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <span>Request Technical Help</span>
              </h3>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-400">
              Submit a help request related to <span className="text-white font-semibold">{project.title}</span>. It will be posted on the Help Request Board for peers and mentors.
            </p>

            {helpSuccess && (
              <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{helpSuccess}</span>
              </div>
            )}

            <form onSubmit={handleRequestHelp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Issue / Question Title</label>
                <input
                  type="text"
                  required
                  value={helpTitle}
                  onChange={(e) => setHelpTitle(e.target.value)}
                  placeholder="e.g. Trouble with SPI clock divider setting"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description of Issue</label>
                <textarea
                  required
                  rows={4}
                  value={helpDesc}
                  onChange={(e) => setHelpDesc(e.target.value)}
                  placeholder="Explain what is failing, error output, or hardware component behavior..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHelpModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={helpSubmitting}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  {helpSubmitting ? "Submitting..." : "Submit Help Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
