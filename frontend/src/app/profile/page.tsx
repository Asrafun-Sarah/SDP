"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserRound,
  Mail,
  GraduationCap,
  Award,
  Save,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  bio?: string | null;
  demonstrated_skills?: string | null;
  created_at: string;
}

export default function MyProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [demonstratedSkills, setDemonstratedSkills] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const profile = await apiFetch<User>("/auth/me");

      if (!profile) {
        setError("Unable to load your profile.");
        return;
      }

      setUser(profile);

      setName(profile.name || "");
      setDepartment(profile.department || "");
      setBio(profile.bio || "");
      setDemonstratedSkills(
        profile.demonstrated_skills || ""
      );
    } catch (err) {
      console.error(
        "Failed to load profile:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedUser = await apiFetch<User>(
        "/auth/profile",
        {
          method: "PUT",
          body: JSON.stringify({
            name: name.trim(),
            department: department.trim(),
            bio: bio.trim(),
            demonstrated_skills:
              demonstratedSkills.trim(),
          }),
        }
      );

      setUser(updatedUser);

      setName(updatedUser.name || "");
      setDepartment(updatedUser.department || "");
      setBio(updatedUser.bio || "");
      setDemonstratedSkills(
        updatedUser.demonstrated_skills || ""
      );

      setSuccess(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Failed to update profile:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  function formatJoinDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <RefreshCw
            size={20}
            className="loading-icon"
          />

          <span>Loading your profile...</span>
        </div>

        <style jsx>{`
          .loading-icon {
            animation: spin 1s linear infinite;
            color: var(--primary-cyan);
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </main>
    );
  }

  if (!user) {
    return (
      <main
        className="container"
        style={{
          padding: "5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            marginBottom: "0.75rem",
          }}
        >
          Unable to load profile
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
          }}
        >
          {error ||
            "Please make sure you are logged in."}
        </p>

        <Link
          href="/dashboard"
          className="btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main
      className="container"
      style={{
        padding: "3rem 1.5rem 5rem",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >

        {/* Back Button */}

        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "0.85rem",
            marginBottom: "1.5rem",
          }}
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </Link>

        {/* Page Header */}

        <div
          style={{
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              margin: "0 0 0.35rem",
              color: "var(--primary-cyan)",
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            PROJECTFORGE / PROFILE
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: 800,
            }}
          >
            My Profile
          </h1>

          <p
            style={{
              marginTop: "0.5rem",
              color: "var(--text-muted)",
              fontSize: "0.9rem",
            }}
          >
            Update the information other students see
            on your profile.
          </p>
        </div>

        {/* Profile Card */}

        <section
          className="glass-card"
          style={{
            padding: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              paddingBottom: "1.5rem",
              marginBottom: "1.5rem",
              borderBottom:
                "1px solid var(--border-color)",
            }}
          >
            {/* Avatar */}

            <div
              style={{
                width: "4.5rem",
                height: "4.5rem",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow:
                  "0 0 20px rgba(56, 189, 248, 0.25)",
              }}
            >
              <UserRound
                size={30}
                color="#ffffff"
              />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  fontWeight: 800,
                }}
              >
                {user.name}
              </h2>

              <p
                style={{
                  margin: "0.25rem 0 0",
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                }}
              >
                Member since{" "}
                {formatJoinDate(
                  user.created_at
                )}
              </p>
            </div>
          </div>

          {/* Error */}

          {error && (
            <div
              style={{
                padding: "0.85rem 1rem",
                marginBottom: "1rem",
                borderRadius: "9px",
                background:
                  "rgba(248, 113, 113, 0.08)",
                border:
                  "1px solid rgba(248, 113, 113, 0.25)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#f87171",
                  fontSize: "0.82rem",
                }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Success */}

          {success && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.85rem 1rem",
                marginBottom: "1rem",
                borderRadius: "9px",
                background:
                  "rgba(52, 211, 153, 0.08)",
                border:
                  "1px solid rgba(52, 211, 153, 0.25)",
              }}
            >
              <CheckCircle2
                size={17}
                color="#34d399"
              />

              <p
                style={{
                  margin: 0,
                  color: "#34d399",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                }}
              >
                {success}
              </p>
            </div>
          )}

          {/* Name */}

          <div
            style={{
              marginBottom: "1.25rem",
            }}
          >
            <label
              htmlFor="name"
              style={{
                display: "block",
                marginBottom: "0.45rem",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--text-main)",
              }}
            >
              Name
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <UserRound
                size={16}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  color:
                    "var(--text-subtle)",
                }}
              />

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                  setSuccess("");
                }}
                className="input-field"
                style={{
                  width: "100%",
                  paddingLeft: "2.6rem",
                }}
              />
            </div>
          </div>

          {/* Email */}

          <div
            style={{
              marginBottom: "1.25rem",
            }}
          >
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "0.45rem",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--text-main)",
              }}
            >
              Email
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  color:
                    "var(--text-subtle)",
                }}
              />

              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="input-field"
                style={{
                  width: "100%",
                  paddingLeft: "2.6rem",
                  opacity: 0.65,
                  cursor: "not-allowed",
                }}
              />
            </div>

            <p
              style={{
                margin:
                  "0.35rem 0 0",
                color:
                  "var(--text-subtle)",
                fontSize: "0.7rem",
              }}
            >
              Email cannot be changed.
            </p>
          </div>

          {/* Department */}

          <div
            style={{
              marginBottom: "1.25rem",
            }}
          >
            <label
              htmlFor="department"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                marginBottom: "0.45rem",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--text-main)",
              }}
            >
              <GraduationCap
                size={16}
                color="var(--primary-cyan)"
              />

              Department
            </label>

            <input
              id="department"
              type="text"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setError("");
                setSuccess("");
              }}
              className="input-field"
              style={{
                width: "100%",
              }}
            />
          </div>

          {/* Bio */}

          <div
            style={{
              marginBottom: "1.25rem",
            }}
          >
            <label
              htmlFor="bio"
              style={{
                display: "block",
                marginBottom: "0.45rem",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--text-main)",
              }}
            >
              Bio
            </label>

            <textarea
              id="bio"
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setError("");
                setSuccess("");
              }}
              placeholder="Tell other students a little about yourself..."
              rows={5}
              className="input-field"
              style={{
                width: "100%",
                resize: "vertical",
              }}
            />
          </div>

          {/* Demonstrated Skills */}

          <div
            style={{
              marginBottom: "1.5rem",
            }}
          >
            <label
              htmlFor="skills"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                marginBottom: "0.45rem",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--text-main)",
              }}
            >
              <Award
                size={16}
                color="var(--accent-amber)"
              />

              Demonstrated Skills
            </label>

            <textarea
              id="skills"
              value={demonstratedSkills}
              onChange={(e) => {
                setDemonstratedSkills(
                  e.target.value
                );
                setError("");
                setSuccess("");
              }}
              placeholder="C++, Python, Arduino, Circuit Design"
              rows={3}
              className="input-field"
              style={{
                width: "100%",
                resize: "vertical",
              }}
            />

            <p
              style={{
                margin:
                  "0.35rem 0 0",
                color:
                  "var(--text-subtle)",
                fontSize: "0.7rem",
              }}
            >
              Separate skills with commas.
            </p>
          </div>

          {/* Save */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={saveProfile}
              disabled={saving}
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {saving ? (
                <>
                  <RefreshCw
                    size={15}
                    className="loading-icon"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </section>

        {/* Public Profile Link */}

        <div
          className="glass-card"
          style={{
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 0.25rem",
                fontWeight: 700,
                fontSize: "0.88rem",
              }}
            >
              Want to see your public profile?
            </p>

            <p
              style={{
                margin: 0,
                color: "var(--text-muted)",
                fontSize: "0.76rem",
              }}
            >
              This is the profile other students can
              view.
            </p>
          </div>

          <Link
            href={`/profile/${user.id}`}
            className="btn-secondary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              textDecoration: "none",
            }}
          >
            View Public Profile
          </Link>
        </div>

      </div>
    </main>
  );
}
