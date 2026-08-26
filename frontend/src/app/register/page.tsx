"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Mail, Lock, Building2, User } from "lucide-react";

import { apiFetch, setToken, User as UserType } from "@/lib/api";

interface RegisterResponse {
  access_token: string;
  token_type: string;
  user: UserType;
}

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await apiFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department: formData.department,
          bio: formData.bio || undefined,
        }),
      });

      setToken(data.access_token);

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);

      setError(
        err?.message ||
          "Registration failed. Please check your information and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: "4rem 1.5rem" }}>
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: "2rem",
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                margin: "0 auto 1rem",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                color: "white",
              }}
            >
              <UserPlus size={28} />
            </div>

            <h1
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                marginBottom: "0.5rem",
              }}
            >
              Create Your Account
            </h1>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              Join ProjectForge and connect with your peers.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginBottom: "1.25rem",
                padding: "0.85rem 1rem",
                borderRadius: "8px",
                background: "rgba(244, 63, 94, 0.12)",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                color: "#f87171",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.1rem",
            }}
          >
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                style={{
                  display: "block",
                  marginBottom: "0.45rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Full Name
              </label>

              <div style={{ position: "relative" }}>
                <User
                  size={17}
                  style={{
                    position: "absolute",
                    left: "0.85rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: "0.45rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Email
              </label>

              <div style={{ position: "relative" }}>
                <Mail
                  size={17}
                  style={{
                    position: "absolute",
                    left: "0.85rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  marginBottom: "0.45rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Password
              </label>

              <div style={{ position: "relative" }}>
                <Lock
                  size={17}
                  style={{
                    position: "absolute",
                    left: "0.85rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Create a password"
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="department"
                style={{
                  display: "block",
                  marginBottom: "0.45rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Department
              </label>

              <div style={{ position: "relative" }}>
                <Building2
                  size={17}
                  style={{
                    position: "absolute",
                    left: "0.85rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />

                <input
                  id="department"
                  name="department"
                  type="text"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  placeholder="e.g. ECE"
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                style={{
                  display: "block",
                  marginBottom: "0.45rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Bio{" "}
                <span
                  style={{
                    color: "var(--text-muted)",
                    fontWeight: 400,
                  }}
                >
                  (optional)
                </span>
              </label>

              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell other students a little about yourself..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-main)",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "0.5rem",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontSize: "0.9rem",
              color: "var(--text-muted)",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "var(--primary-cyan)",
                fontWeight: 600,
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
