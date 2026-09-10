"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  GraduationCap,
  FileText,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface RegisteredUser {
  id: number;
  name: string;
  email: string;
  department: string;
  bio?: string;
  demonstrated_skills?: string[] | string;
  created_at?: string;
}

interface RegisterResponse {
  access_token: string;
  token_type: string;
  user?: RegisteredUser;
}

const departments = [
  "Electrical & Computer Engineering",
  "Computer Science & Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Industrial & Production Engineering",
  "Electrical & Electronic Engineering",
  "Mechatronics Engineering",
  "Other",
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState(
    "Electrical & Computer Engineering"
  );
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your university email.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          department,
          bio: bio.trim(),
        }),
      });

      /*
       * Save the new login through the existing AuthContext.
       * This keeps the token and user information consistent
       * with the rest of ProjectForge.
       */
      if (data.user) {
        login(data.access_token, data.user);
      } else {
        localStorage.setItem("access_token", data.access_token);
      }

      /*
       * There is no /onboarding route in this project.
       * After successful registration, go directly to Home.
       */
      router.replace("/home");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 15% 20%, rgba(56, 189, 248, 0.10), transparent 30%), radial-gradient(circle at 85% 80%, rgba(139, 92, 246, 0.10), transparent 30%), var(--background)",
        padding: "2rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1050px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
          gap: "2rem",
          alignItems: "stretch",
        }}
      >
        {/* LEFT SIDE */}
        <section
          className="glass-card"
          style={{
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "650px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "260px",
              height: "260px",
              borderRadius: "50%",
              background: "rgba(56, 189, 248, 0.08)",
              filter: "blur(10px)",
              top: "-100px",
              right: "-100px",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.45rem 0.9rem",
                borderRadius: "999px",
                background: "rgba(56, 189, 248, 0.10)",
                border: "1px solid rgba(56, 189, 248, 0.25)",
                color: "var(--primary-cyan)",
                fontSize: "0.8rem",
                fontWeight: 600,
                marginBottom: "1.75rem",
              }}
            >
              <Sparkles size={15} />
              Built for Engineering Students
            </div>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                lineHeight: 1.1,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                marginBottom: "1.25rem",
              }}
            >
              Create your
              <br />
              <span className="gradient-text">ProjectForge account.</span>
            </h1>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1rem",
                lineHeight: 1.7,
                maxWidth: "470px",
                marginBottom: "2rem",
              }}
            >
              Join a community where engineering students can share projects,
              discover useful technologies, showcase their skills, and connect
              with other students.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <Feature
                icon={<CheckCircle2 size={19} />}
                title="Share your projects"
                description="Build your academic and personal project portfolio."
              />

              <Feature
                icon={<CheckCircle2 size={19} />}
                title="Show your skills"
                description="Let other students discover what you can build."
              />

              <Feature
                icon={<CheckCircle2 size={19} />}
                title="Connect with students"
                description="Learn from people who have worked on similar projects."
              />
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section
          className="glass-card"
          style={{
            padding: "2.5rem",
            minHeight: "650px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ maxWidth: "520px", width: "100%", margin: "0 auto" }}>
            <div style={{ marginBottom: "2rem" }}>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 750,
                  marginBottom: "0.5rem",
                }}
              >
                Create Account
              </h2>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.95rem",
                }}
              >
                Start building your engineering project profile.
              </p>
            </div>

            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.7rem",
                  padding: "0.9rem 1rem",
                  marginBottom: "1.25rem",
                  borderRadius: "10px",
                  background: "rgba(239, 68, 68, 0.10)",
                  border: "1px solid rgba(239, 68, 68, 0.30)",
                  color: "#fca5a5",
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.15rem",
              }}
            >
              <FormField
                label="Full Name"
                icon={<User size={17} />}
                required
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={loading}
                  style={inputStyle}
                />
              </FormField>

              <FormField
                label="University Email"
                icon={<Mail size={17} />}
                required
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your university email"
                  autoComplete="email"
                  disabled={loading}
                  style={inputStyle}
                />
              </FormField>

              <FormField
                label="Department"
                icon={<GraduationCap size={17} />}
                required
              >
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={loading}
                  style={inputStyle}
                >
                  {departments.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Password"
                icon={<Lock size={17} />}
                required
              >
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    disabled={loading}
                    style={{
                      ...inputStyle,
                      paddingRight: "3rem",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    disabled={loading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    style={{
                      position: "absolute",
                      right: "0.8rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      padding: "0.25rem",
                    }}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </FormField>

              <FormField
                label="Short Bio"
                icon={<FileText size={17} />}
                optional
              >
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell other students a little about yourself..."
                  rows={3}
                  disabled={loading}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    minHeight: "90px",
                  }}
                />
              </FormField>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "0.9rem 1.2rem",
                  fontSize: "1rem",
                  marginTop: "0.35rem",
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div
              style={{
                textAlign: "center",
                marginTop: "1.75rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--border-color)",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                style={{
                  color: "var(--primary-cyan)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Log in
              </Link>
            </div>

            <p
              style={{
                textAlign: "center",
                marginTop: "1rem",
                color: "var(--text-muted)",
                fontSize: "0.75rem",
                lineHeight: 1.5,
              }}
            >
              By creating an account, you can upload projects, manage your
              work, and connect with other engineering students.
            </p>
          </div>
        </section>
      </div>

      <style jsx>{`
        @media (max-width: 850px) {
          main {
            padding: 1rem !important;
          }

          main > div {
            grid-template-columns: 1fr !important;
          }

          main > div > section:first-child {
            min-height: auto !important;
            padding: 2rem !important;
          }

          main > div > section:last-child {
            min-height: auto !important;
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.9rem",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "2.1rem",
          height: "2.1rem",
          borderRadius: "9px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: "rgba(56, 189, 248, 0.10)",
          border: "1px solid rgba(56, 189, 248, 0.20)",
          color: "var(--primary-cyan)",
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontWeight: 650,
            fontSize: "0.95rem",
            marginBottom: "0.2rem",
          }}
        >
          {title}
        </div>

        <div
          style={{
            color: "var(--text-muted)",
            fontSize: "0.82rem",
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  icon,
  required,
  optional,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          marginBottom: "0.45rem",
          fontSize: "0.86rem",
          fontWeight: 600,
        }}
      >
        <span style={{ color: "var(--primary-cyan)" }}>{icon}</span>
        {label}

        {required && (
          <span
            style={{
              color: "var(--primary-cyan)",
              fontSize: "0.75rem",
            }}
          >
            *
          </span>
        )}

        {optional && (
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "0.72rem",
              fontWeight: 400,
            }}
          >
            (optional)
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "0.78rem 0.9rem",
  borderRadius: "9px",
  border: "1px solid var(--border-color)",
  background: "rgba(17, 24, 39, 0.55)",
  color: "var(--text-primary)",
  outline: "none",
  fontSize: "0.9rem",
};