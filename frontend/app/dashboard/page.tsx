"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, User, Project, HelpRequest } from "@/lib/api";
import { LayoutDashboard, Rocket, HelpCircle, FolderGit2, PlusCircle, ShieldCheck, User as UserIcon, CheckCircle } from "lucide-react";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [myHelpRequests, setMyHelpRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const me = await apiFetch("/api/auth/me");
      if (!me) {
        router.push("/login");
        return;
      }
      setUser(me);

      const [projs, helps] = await Promise.all([
        apiFetch("/api/projects/my-projects").catch(() => []),
        apiFetch("/api/help-requests").catch(() => []),
      ]);

      setMyProjects(projs);
      setMyHelpRequests(helps.filter((h: HelpRequest) => h.user_id === me.id || h.helper_id === me.id));
    } catch (err) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-sm">Loading student dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-950 text-blue-400 text-xs font-semibold mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome, {user?.name}</h1>
          <p className="text-xs text-slate-400 mt-1">{user?.department} • {user?.email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/profile"
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <UserIcon className="w-4 h-4 text-blue-400" />
            <span>View Profile & Experience</span>
          </Link>
          <Link
            href="/projects/new"
            className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload New Project</span>
          </Link>
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-blue-950 text-blue-400 rounded-lg">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{myProjects.length}</div>
            <div className="text-xs text-slate-400">My Uploaded Projects</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-indigo-950 text-indigo-400 rounded-lg">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{myHelpRequests.length}</div>
            <div className="text-xs text-slate-400">Help Inquiries</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-950 text-emerald-400 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">Active Student</div>
            <div className="text-xs text-slate-400">Verified Technical Profile</div>
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-400" />
            <span>My Projects</span>
          </h2>
          <Link href="/my-projects" className="text-xs font-semibold text-blue-400 hover:underline">
            Manage All Projects →
          </Link>
        </div>

        {myProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myProjects.map((proj) => (
              <div key={proj.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-950 text-blue-300 rounded">
                    {proj.category}
                  </span>
                </div>
                <h3 className="font-bold text-base text-white">{proj.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">{proj.description}</p>
                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                  Tech Stack: <span className="font-mono text-slate-300">{proj.tech_stack}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-xs text-slate-400">
            You haven't uploaded any projects yet. <Link href="/projects/new" className="text-blue-400 font-semibold hover:underline">Upload a project now</Link>.
          </div>
        )}
      </div>

      {/* Help Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span>My Help Requests & Mentorship</span>
          </h2>
          <Link href="/help" className="text-xs font-semibold text-indigo-400 hover:underline">
            View Help Board →
          </Link>
        </div>

        {myHelpRequests.length > 0 ? (
          <div className="space-y-3">
            {myHelpRequests.map((req) => (
              <div key={req.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white text-sm">{req.title}</div>
                  <div className="text-slate-400 mt-0.5">{req.category} • Posted by {req.author?.name}</div>
                </div>
                <span className={`px-2.5 py-1 rounded font-semibold text-xs border ${
                  req.status === "Accepted"
                    ? "bg-emerald-950 text-emerald-300 border-emerald-800/40"
                    : req.status === "Declined"
                    ? "bg-rose-950 text-rose-300 border-rose-800/40"
                    : "bg-amber-950 text-amber-300 border-amber-800/40"
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-xs text-slate-400">
            No active help requests.
          </div>
        )}
      </div>
    </div>
  );
}
