"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, setToken } from "@/lib/api";
import { UserPlus, Cpu, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Electrical & Computer Engineering");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, department }),
      });
      setToken(data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to register account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="glass-card p-8 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-cyan-950 text-cyan-400 rounded-xl mb-2">
            <Cpu className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Student Account</h1>
          <p className="text-xs text-slate-400">Join the engineering collaboration hub</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah Connor"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">University Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@engineering.edu"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Engineering Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-slate-900 text-white"
            >
              <option value="Electrical & Computer Engineering">Electrical & Computer Engineering</option>
              <option value="Robotics & Mechatronics">Robotics & Mechatronics</option>
              <option value="Software & Computer Science">Software & Computer Science</option>
              <option value="Mechanical & Aerospace">Mechanical & Aerospace</option>
              <option value="Civil & Environmental">Civil & Environmental</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-95 transition-opacity shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? "Registering..." : "Create Account"}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
