"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, UserRound, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
  bio?: string | null;
  demonstrated_skills?: string | null;
  created_at: string;
}

export default function StudentSearch() {
  const [searchName, setSearchName] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function searchStudents() {
    const name = searchName.trim();

    if (!name) {
      setStudents([]);
      setSearched(false);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      setError("");

      const data = await apiFetch<Student[]>(
        `/student-requests/search?name=${encodeURIComponent(name)}`
      );

      setStudents(data);
    } catch (err) {
      console.error("Failed to search students:", err);
      setError("Unable to search students. Please try again.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="glass-panel"
      style={{
        padding: "1.25rem",
        borderRadius: "12px",
        marginBottom: "2rem",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <p
          style={{
            color: "var(--primary-cyan)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            marginBottom: "0.35rem",
          }}
        >
          PROJECTFORGE / NETWORK
        </p>

        <h2
          style={{
            fontSize: "1.35rem",
            fontWeight: 750,
            marginBottom: "0.35rem",
          }}
        >
          Find Students
        </h2>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.88rem",
          }}
        >
          Search registered engineering students and connect with them.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: "240px",
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-subtle)",
            }}
          />

          <input
            type="text"
            placeholder="Search by student name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchStudents();
              }
            }}
            className="input-field"
            style={{ paddingLeft: "2.8rem" }}
          />
        </div>

        <button
          type="button"
          onClick={searchStudents}
          className="btn-primary"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
          <Search size={15} />
        </button>
      </div>

      {error && (
        <p
          style={{
            color: "#f87171",
            fontSize: "0.85rem",
            marginTop: "1rem",
          }}
        >
          {error}
        </p>
      )}

      {loading && (
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            marginTop: "1rem",
          }}
        >
          Searching registered students...
        </p>
      )}

      {!loading && searched && students.length === 0 && !error && (
        <div
          style={{
            padding: "2rem 1rem",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <UserRound
            size={34}
            style={{
              marginBottom: "0.75rem",
              color: "var(--text-subtle)",
            }}
          />

          <p>No student found with that name.</p>
        </div>
      )}

      {!loading && students.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            marginTop: "1.25rem",
          }}
        >
          {students.map((student) => (
            <article
              key={student.id}
              className="glass-card"
              style={{
                padding: "1.15rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: "2.75rem",
                    height: "2.75rem",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <UserRound size={20} color="#ffffff" />
                </div>

                <div style={{ minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      marginBottom: "0.2rem",
                    }}
                  >
                    {student.name}
                  </h3>

                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.78rem",
                    }}
                  >
                    {student.department}
                  </p>
                </div>
              </div>

              <p
                style={{
                  color: "var(--text-subtle)",
                  fontSize: "0.78rem",
                  marginBottom: "1rem",
                }}
              >
                {student.email}
              </p>

              <Link
                href={`/profile/${student.id}`}
                className="btn-secondary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                View Profile
                <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}