"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { ProjectCard, Project } from "@/components/ProjectCard";
import {
  User,
  Mail,
  GraduationCap,
  Award,
  FolderGit2,
  Calendar,
  Send,
  MessageCircle,
} from "lucide-react";

interface DemonstratedSkill {
  technology: string;
  project_count: number;
}

interface PublicProfile {
  id: number;
  full_name: string;
  email: string;
  department: string;
  bio?: string;
  created_at: string;
  projects_count: number;
  demonstrated_skills: DemonstratedSkill[];
}

interface StudentRequest {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  status: string;
  created_at: string;
}

export default function StudentProfilePage() {
  const params = useParams();
  const userId = params.id;
  const { user } = useAuth();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState("");

  const [connectionAccepted, setConnectionAccepted] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);

        const [profileData, userProjects] = await Promise.all([
          apiFetch<PublicProfile>(`/users/${userId}`),
          apiFetch<Project[]>(`/users/${userId}/projects`),
        ]);

        setProfile(profileData);
        setProjects(userProjects);
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadProfileData();
    }
  }, [userId]);

  useEffect(() => {
    async function checkConnection() {
      if (!userId || !user) {
        setCheckingConnection(false);
        return;
      }

      const targetUserId = Number(userId);
      const currentUserId = Number(user.id);

      if (currentUserId === targetUserId) {
        setCheckingConnection(false);
        return;
      }

      try {
        setCheckingConnection(true);

        const [sentRequests, receivedRequests] = await Promise.all([
          apiFetch<StudentRequest[]>("/student-requests/sent"),
          apiFetch<StudentRequest[]>("/student-requests/received"),
        ]);

        const acceptedSentRequest = sentRequests.some(
          (request) =>
            request.receiver_id === targetUserId &&
            request.status === "Accepted"
        );

        const acceptedReceivedRequest = receivedRequests.some(
          (request) =>
            request.sender_id === targetUserId &&
            request.status === "Accepted"
        );

        setConnectionAccepted(
          acceptedSentRequest || acceptedReceivedRequest
        );

        const pendingSentRequest = sentRequests.some(
          (request) =>
            request.receiver_id === targetUserId &&
            request.status === "Pending"
        );

        const pendingReceivedRequest = receivedRequests.some(
          (request) =>
            request.sender_id === targetUserId &&
            request.status === "Pending"
        );

        if (pendingSentRequest || pendingReceivedRequest) {
          setRequestSent(true);
        }
      } catch (err) {
        console.error("Failed to check student connection:", err);
      } finally {
        setCheckingConnection(false);
      }
    }

    checkConnection();
  }, [userId, user]);

  async function sendStudentRequest() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setRequestError("Please write a message before sending.");
      return;
    }

    try {
      setSendingRequest(true);
      setRequestError("");

      await apiFetch("/student-requests", {
        method: "POST",
        body: JSON.stringify({
          receiver_id: Number(userId),
          message: trimmedMessage,
        }),
      });

      setRequestSent(true);
      setMessage("");
    } catch (err) {
      console.error("Failed to send student request:", err);

      setRequestError(
        err instanceof Error
          ? err.message
          : "Unable to send request. Please try again."
      );
    } finally {
      setSendingRequest(false);
    }
  }

  if (loading) {
    return (
      <div
        className="container"
        style={{
          padding: "5rem 1.5rem",
          textAlign: "center",
          color: "var(--text-muted)",
        }}
      >
        Loading student profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className="container"
        style={{
          padding: "5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          Student Profile Not Found
        </h2>
      </div>
    );
  }

  const isOwnProfile =
    user && Number(user.id) === Number(profile.id);

  return (
    <div
      className="container"
      style={{
        padding: "3rem 1.5rem",
      }}
    >
      <div
        className="glass-card"
        style={{
          padding: "2.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "5rem",
              height: "5rem",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 20px rgba(56, 189, 248, 0.3)",
            }}
          >
            <User size={36} color="#ffffff" />
          </div>

          <div
            style={{
              flex: 1,
              minWidth: "260px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <h1
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 800,
                }}
              >
                {profile.full_name}
              </h1>

              <span
                style={{
                  background: "rgba(56, 189, 248, 0.12)",
                  border:
                    "1px solid rgba(56, 189, 248, 0.3)",
                  color: "var(--primary-cyan)",
                  padding: "0.35rem 0.875rem",
                  borderRadius: "9999px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                {profile.projects_count}{" "}
                {profile.projects_count === 1
                  ? "Project Published"
                  : "Projects Published"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.5rem",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <GraduationCap
                  size={16}
                  color="var(--primary-cyan)"
                />
                {profile.department}
              </span>

              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Mail size={16} color="#c084fc" />
                {profile.email}
              </span>

              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Calendar size={16} color="#34d399" />
                Joined{" "}
                {new Date(profile.created_at).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    year: "numeric",
                  }
                )}
              </span>
            </div>

            {profile.bio && (
              <p
                style={{
                  color: "var(--text-main)",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  background: "rgba(0,0,0,0.2)",
                  padding: "0.875rem 1.125rem",
                  borderRadius: "8px",
                }}
              >
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {!isOwnProfile && (
        <div
          className="glass-card"
          style={{
            padding: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "0.5rem",
            }}
          >
            {connectionAccepted ? (
              <MessageCircle
                size={21}
                color="var(--primary-cyan)"
              />
            ) : (
              <Send
                size={21}
                color="var(--primary-cyan)"
              />
            )}

            <h2
              style={{
                fontSize: "1.35rem",
                fontWeight: 800,
              }}
            >
              {connectionAccepted
                ? `Chat With ${profile.full_name}`
                : `Connect With ${profile.full_name}`}
            </h2>
          </div>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              marginBottom: "1.25rem",
            }}
          >
            {connectionAccepted
              ? `You are connected with ${profile.full_name}. Continue your conversation.`
              : `Send a message request to connect with this student.`}
          </p>

          {checkingConnection ? (
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
              }}
            >
              Checking connection status...
            </p>
          ) : connectionAccepted ? (
            <Link
              href={`/messages/${profile.id}`}
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Continue Chat
              <MessageCircle size={15} />
            </Link>
          ) : requestSent ? (
            <div
              style={{
                padding: "1rem",
                borderRadius: "8px",
                background:
                  "rgba(52, 211, 153, 0.1)",
                border:
                  "1px solid rgba(52, 211, 153, 0.3)",
                color: "#34d399",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              ✓ Request sent successfully. You can
              wait for their response.
            </div>
          ) : (
            <>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setRequestError("");
                }}
                placeholder={`Write a message to ${profile.full_name}...`}
                rows={4}
                className="input-field"
                style={{
                  width: "100%",
                  resize: "vertical",
                  marginBottom: "0.75rem",
                }}
              />

              {requestError && (
                <p
                  style={{
                    color: "#f87171",
                    fontSize: "0.85rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {requestError}
                </p>
              )}

              <button
                type="button"
                onClick={sendStudentRequest}
                className="btn-primary"
                disabled={sendingRequest}
              >
                {sendingRequest
                  ? "Sending..."
                  : "Send Request"}

                <Send size={15} />
              </button>
            </>
          )}
        </div>
      )}

      <div
        style={{
          marginBottom: "3rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Award
            size={22}
            color="var(--accent-amber)"
          />
          Demonstrated Experience
        </h2>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            marginBottom: "1.25rem",
          }}
        >
          Skills automatically aggregated from{" "}
          {profile.full_name}'s completed engineering
          projects
        </p>

        {profile.demonstrated_skills.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "0.875rem",
            }}
          >
            No demonstrated experience available yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {profile.demonstrated_skills.map(
              (skill, idx) => (
                <div
                  key={idx}
                  className="glass-card"
                  style={{
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      color: "var(--text-main)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {skill.technology}
                  </span>

                  <span
                    style={{
                      background:
                        "rgba(251, 191, 36, 0.15)",
                      border:
                        "1px solid rgba(251, 191, 36, 0.3)",
                      color: "var(--accent-amber)",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.775rem",
                      fontWeight: 700,
                    }}
                  >
                    {skill.project_count}{" "}
                    {skill.project_count === 1
                      ? "project"
                      : "projects"}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <FolderGit2
            size={22}
            color="var(--primary-cyan)"
          />
          Student Projects ({projects.length})
        </h2>

        {projects.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            This student has not uploaded any projects yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}