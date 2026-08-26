"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { Project } from "@/components/ProjectCard";
import {
  FolderGit2,
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Search,
  User,
  ArrowRight,
  Send,
  Inbox
} from "lucide-react";

interface DashboardStats {
  uploaded_projects_count: number;
  sent_requests_count: number;
  received_requests_count: number;
  pending_requests_count: number;
}

interface HelpRequest {
  id: number;
  project_id: number;
  requester_id: number;
  recipient_id: number;
  message: string;
  status: "Pending" | "Accepted" | "Declined";
  created_at: string;
  project_title?: string;
  requester: {
    id: number;
    full_name: string;
    email: string;
    department: string;
  };
  recipient: {
    id: number;
    full_name: string;
    email: string;
    department: string;
  };
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [receivedRequests, setReceivedRequests] = useState<HelpRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, receivedData, sentData] = await Promise.all([
        apiFetch<DashboardStats>("/dashboard/stats"),
        apiFetch<HelpRequest[]>("/requests/received"),
        apiFetch<HelpRequest[]>("/requests/sent"),
      ]);

      setStats(statsData);
      setReceivedRequests(receivedData);
      setSentRequests(sentData);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: number, newStatus: "Accepted" | "Declined") => {
    try {
      setUpdatingId(requestId);
      await apiFetch(`/requests/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      await loadDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to update help request status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
        Loading student dashboard...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "3rem 1.5rem" }}>
      {/* Welcome Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>
            Welcome back, <span className="gradient-text">{user?.full_name}</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            {user?.department} • Student Dashboard Overview
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/projects/upload" className="btn-primary">
            <PlusCircle size={16} />
            Upload New Project
          </Link>
          <Link href="/projects/my-projects" className="btn-secondary">
            <FolderGit2 size={16} />
            Manage My Projects
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Uploaded Projects</span>
            <FolderGit2 size={18} color="var(--primary-cyan)" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{stats?.uploaded_projects_count || 0}</div>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Received Requests</span>
            <Inbox size={18} color="#c084fc" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{stats?.received_requests_count || 0}</div>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Pending Action</span>
            <Clock size={18} color="#fbbf24" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fbbf24" }}>{stats?.pending_requests_count || 0}</div>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Sent Help Requests</span>
            <Send size={18} color="#34d399" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{stats?.sent_requests_count || 0}</div>
        </div>
      </div>

      {/* Main Content Split: Received Requests & Sent Requests */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem" }}>
        
        {/* Received Help Requests Section */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Inbox size={20} color="var(--primary-cyan)" />
              Received Peer Help Requests
            </h2>
            {stats && stats.pending_requests_count > 0 && (
              <span style={{ background: "rgba(251, 191, 36, 0.15)", border: "1px solid rgba(251, 191, 36, 0.3)", color: "#fbbf24", padding: "0.2rem 0.6rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600 }}>
                {stats.pending_requests_count} Pending
              </span>
            )}
          </div>

          {receivedRequests.length === 0 ? (
            <div className="glass-card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              You haven't received any help requests yet. As you upload more projects, peers working on similar topics will reach out!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {receivedRequests.map((req) => (
                <div key={req.id} className="glass-card" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary-cyan)" }}>
                      Project: {req.project_title}
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        backgroundColor:
                          req.status === "Accepted"
                            ? "rgba(52, 211, 153, 0.15)"
                            : req.status === "Declined"
                            ? "rgba(244, 63, 94, 0.15)"
                            : "rgba(251, 191, 36, 0.15)",
                        color:
                          req.status === "Accepted"
                            ? "#34d399"
                            : req.status === "Declined"
                            ? "#f43f5e"
                            : "#fbbf24",
                      }}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.9rem", color: "var(--text-main)", marginBottom: "0.75rem", background: "rgba(0,0,0,0.2)", padding: "0.75rem", borderRadius: "6px", fontStyle: "italic" }}>
                    "{req.message}"
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.825rem", color: "var(--text-muted)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <User size={13} />
                      <span>{req.requester.full_name} ({req.requester.department})</span>
                    </div>

                    {req.status === "Pending" ? (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleStatusUpdate(req.id, "Accepted")}
                          disabled={updatingId === req.id}
                          className="btn-primary"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }}
                        >
                          <CheckCircle2 size={14} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(req.id, "Declined")}
                          disabled={updatingId === req.id}
                          className="btn-secondary"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", color: "#f87171" }}
                        >
                          <XCircle size={14} />
                          Decline
                        </button>
                      </div>
                    ) : req.status === "Accepted" ? (
                      <div style={{ color: "#34d399", fontSize: "0.8rem", fontWeight: 500 }}>
                        Email: {req.requester.email}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sent Help Requests Section */}
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Send size={20} color="#34d399" />
            My Sent Help Requests
          </h2>

          {sentRequests.length === 0 ? (
            <div className="glass-card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              You haven't requested help on any project yet. Browse projects to connect with experienced peers!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {sentRequests.map((req) => (
                <div key={req.id} className="glass-card" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
                      Target Project: {req.project_title}
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        backgroundColor:
                          req.status === "Accepted"
                            ? "rgba(52, 211, 153, 0.15)"
                            : req.status === "Declined"
                            ? "rgba(244, 63, 94, 0.15)"
                            : "rgba(251, 191, 36, 0.15)",
                        color:
                          req.status === "Accepted"
                            ? "#34d399"
                            : req.status === "Declined"
                            ? "#f43f5e"
                            : "#fbbf24",
                      }}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                    "{req.message}"
                  </p>

                  <div style={{ fontSize: "0.825rem", color: "var(--text-subtle)", display: "flex", justifyContent: "space-between" }}>
                    <span>Sent to: {req.recipient.full_name}</span>
                    {req.status === "Accepted" && (
                      <span style={{ color: "#34d399", fontWeight: 600 }}>
                        Peer Email: {req.recipient.email}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
