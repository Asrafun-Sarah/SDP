"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { LogIn, AlertCircle } from "lucide-react";

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    department: string;
    bio?: string;
    demonstrated_skills?: string;
    created_at?: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch<LoginResponse>(
        "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const user = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        department: res.user.department,
        bio: res.user.bio,
        demonstrated_skills:
          res.user.demonstrated_skills,
        created_at:
          res.user.created_at ||
          new Date().toISOString(),
      };

      login(res.access_token, user);

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Invalid credentials. Please check your email and password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        padding: "5rem 1.5rem",
        maxWidth: "460px",
      }}
    >
      <div
        className="glass-card"
        style={{ padding: "2.5rem" }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem auto",
            }}
          >
            <LogIn size={24} color="#ffffff" />
          </div>

          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
            }}
          >
            Student Log In
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            Access your ProjectForge dashboard
          </p>
        </div>

        {error && (
          <div
            style={{
              background:
                "rgba(244, 63, 94, 0.12)",
              border:
                "1px solid rgba(244, 63, 94, 0.3)",
              color: "#fb7185",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "0.4rem",
              }}
            >
              University Email
            </label>

            <input
              type="email"
              required
              className="input-field"
              placeholder="alex.chen@university.edu"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "0.4rem",
              }}
            >
              Password
            </label>

            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "0.75rem",
              marginTop: "0.5rem",
            }}
          >
            {loading
              ? "Authenticating..."
              : "Log In"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.875rem",
            color: "var(--text-muted)",
          }}
        >
          Don't have an account yet?{" "}

          <Link
            href="/register"
            style={{
              color: "var(--primary-cyan)",
              fontWeight: 600,
            }}
          >
            Sign Up here
          </Link>
        </div>
      </div>
    </div>
  );
}
