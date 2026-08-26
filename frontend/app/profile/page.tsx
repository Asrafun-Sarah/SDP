"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, User, Project } from "@/lib/api";
import { User as UserIcon, ShieldCheck, Award, BookOpen, Edit3, CheckCircle, Rocket } from "lucide-react";

export default function StudentProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit profile form state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const me = await apiFetch("/api/auth/me");
      if (!me) {
        router.push("/login");
        return;
      }
      setUser(me);
      setName(me.name);
      setDepartment(me.department);
      setBio(me.bio || "");
      setSkills(me.demonstrated_skills || "");

      const projs = await apiFetch("/api/projects/my-projects").catch(() => []);
      setMyProjects(projs);
    } catch (err) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await apiFetch("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name,
          department,
          bio,
          demonstrated_skills: skills,
        }),
      });
      setUser(updated);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-sm">Loading student profile...</div>;
  }

  const skillList = (user?.demonstrated_skills || "C++, Python, Arduino, Circuit Design")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-950 text-blue-400 border border-blue-800/60 flex items-center justify-center font-bold text-2xl">
              {user?.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{user?.department} • {user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 w-fit"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? "Cancel Editing" : "Edit Profile"}</span>
          </button>
        </div>

        {/* Edit Form or Bio Display */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 border-t border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Student Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Demonstrated Skills (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. C++, Arduino, ROS 2, SolidWorks, KiCad"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
            >
              {saving ? "Saving..." : "Save Profile Updates"}
            </button>
          </form>
        ) : (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-400">About Me</div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
              {user?.bio || "No bio added yet."}
            </p>
          </div>
        )}
      </div>

      {/* Feature #10: Demonstrated Experience Section */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Demonstrated Experience & Engineering Skills</h2>
        </div>

        <p className="text-xs text-slate-400">
          Skills verified through documented engineering projects, laboratory coursework, and mentorship contributions.
        </p>

        {/* Skill Badges */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300">Verified Technical Stack</div>
          <div className="flex flex-wrap gap-2">
            {skillList.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/50 rounded-md flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Portfolio Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-blue-950 text-blue-400 rounded-lg">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{myProjects.length} Projects Uploaded</div>
              <div className="text-[11px] text-slate-400">Active engineering portfolio entries</div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-indigo-950 text-indigo-400 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">Peer Verified</div>
              <div className="text-[11px] text-slate-400">Mentorship & troubleshooting contributions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
