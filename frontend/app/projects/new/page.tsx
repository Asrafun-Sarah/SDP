"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { PlusCircle, Rocket, AlertCircle } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Embedded Systems");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiFetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          category,
          tech_stack: techStack,
          github_url: githubUrl || null,
          demo_url: demoUrl || null,
        }),
      });
      router.push("/projects");
    } catch (err: any) {
      setError(err.message || "Failed to publish project. Please sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="glass-card p-8 rounded-3xl space-y-6">
        <div className="space-y-2">
          <div className="inline-flex p-3 bg-cyan-950 text-cyan-400 rounded-xl mb-2">
            <Rocket className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Publish New Engineering Project</h1>
          <p className="text-xs text-slate-400">Share your schematics, code, CAD models, or prototype documentation</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Quadcopter Flight Controller with STM32"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-slate-900 text-white"
              >
                <option value="Embedded Systems">Embedded Systems</option>
                <option value="Robotics">Robotics</option>
                <option value="Software">Software & Web</option>
                <option value="CAD/Mechanical">CAD & Mechanical</option>
                <option value="ML/AI">ML & AI</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Technologies Used</label>
              <input
                type="text"
                required
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g. C++, FreeRTOS, KiCad, SolidWorks"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your design architecture, components used, performance results, or instructions..."
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub / Code Repository URL (Optional)</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Video / Demo URL (Optional)</label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-95 transition-opacity shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{loading ? "Publishing..." : "Publish Project"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
