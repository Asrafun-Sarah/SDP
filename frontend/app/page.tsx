"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch, Project, HelpRequest } from "@/lib/api";
import { Rocket, HelpCircle, Cpu, ArrowRight, UserCheck, ShieldCheck, Search, Code } from "lucide-react";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projs, helps] = await Promise.all([
          apiFetch("/api/projects").catch(() => []),
          apiFetch("/api/help-requests").catch(() => [])
        ]);
        setProjects(projs.slice(0, 3));
        setHelpRequests(helps.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-sm space-y-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950 text-blue-400 border border-blue-800/60 text-xs font-semibold">
            <Cpu className="w-4 h-4" />
            <span>University Student Collaboration Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Engineering Project Repository & Help Request Board
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            ProjectForge is a clean, simple platform for engineering students to share hardware and software projects, demonstrate technical experience, and request or provide peer mentorship.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/projects"
              className="px-5 py-2.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors flex items-center gap-2 text-sm"
            >
              <span>Browse Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-sm"
            >
              Student Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-2">
          <div className="w-10 h-10 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center mb-3">
            <Rocket className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">1. Project Repository</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload and document engineering projects with title, tech stack, GitHub links, and descriptions.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-2">
          <div className="w-10 h-10 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center mb-3">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">2. Help & Mentorship</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Submit troubleshooting help requests for circuits, software bugs, or CAD models with Accept/Decline status.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center mb-3">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">3. Demonstrated Experience</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Build your student profile portfolio by verifying hands-on engineering skills and completed projects.
          </p>
        </div>
      </section>

      {/* Recent Projects Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-400" />
            <span>Recent Student Projects</span>
          </h2>
          <Link href="/projects" className="text-xs font-semibold text-blue-400 hover:underline">
            View All Projects →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-950 text-blue-300 border border-blue-800/40 rounded">
                    {p.category}
                  </span>
                  <h3 className="font-bold text-white text-base leading-snug">{p.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{p.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Stack: {p.tech_stack}</span>
                  <span className="text-slate-500">by {p.owner?.name}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-slate-500 text-xs">Loading projects...</div>
          )}
        </div>
      </section>
    </div>
  );
}
