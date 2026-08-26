"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { UserPlus, Cpu, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch<{ access_token: string; user: any }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          email,
          department,
          password,
          bio: bio.trim() || undefined,
        }),
      });

      login(res.access_token, res.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", maxWidth: "520px" }}>
      <div className="glass-card" style={{ padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem auto"
          }}>
            <UserPlus size={24} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Student Registration</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Create an account to upload projects & request guidance
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(244, 63, 94, 0.12)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            color: "#fb7185",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem"
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.4rem" }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. Alex Chen"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.4rem" }}>
              University Email *
            </label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="alex.chen@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.4rem" }}>
              Department *
            </label>
            <select
              className="input-field"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Robotics & Mechatronics">Robotics & Mechatronics</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.4rem" }}>
              Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.4rem" }}>
              Short Bio (Optional)
            </label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Tell peers about your engineering interests, microcontrollers, or technologies you love..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "0.75rem", marginTop: "0.5rem" }}
          >
            {loading ? "Creating Account..." : "Complete Registration"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Already registered?{" "}
          <Link href="/login" style={{ color: "var(--primary-cyan)", fontWeight: 600 }}>
            Log In here
          </Link>
        </div>
      </div>
    </div>
  );
}
