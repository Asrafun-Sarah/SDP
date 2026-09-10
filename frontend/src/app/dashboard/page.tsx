
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  FolderKanban,
  Upload,
  Search,
  UserRound,
  Clock3,
  CheckCircle2,
  XCircle,
  Inbox,
  Send,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";

interface DashboardStats {
  uploaded_projects_count: number;
  sent_requests_count: number;
  received_requests_count: number;
  pending_requests_count: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  tech_stack: string;
  github_url?: string | null;
  demo_url?: string | null;
  user_id: number;
  created_at: string;
}

interface HelpRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  project_id?: number | null;
  user_id: number;
  helper_id?: number | null;
  created_at: string;
  author?: {
    id: number;
    name: string;
    email: string;
  };
  helper?: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [requestActivity, setRequestActivity] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    loadDashboard();
  }, [user, authLoading, router]);

  async function loadDashboard() {
    try {
      setLoading(true);

      const [statsData, projectsData, requestsData] = await Promise.all([
        apiFetch<DashboardStats>("/dashboard/stats"),
        apiFetch<Project[]>("/dashboard/recent-projects"),
        apiFetch<HelpRequest[]>("/dashboard/request-activity"),
      ]);

      setStats(statsData);
      setRecentProjects(projectsData);
      setRequestActivity(requestsData);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusIcon(status: string) {
    if (status === "Accepted") {
      return <CheckCircle2 size={16} />;
    }

    if (status === "Declined") {
      return <XCircle size={16} />;
    }

    return <Clock3 size={16} />;
  }

  function getStatusClass(status: string) {
    if (status === "Accepted") return "status accepted";
    if (status === "Declined") return "status declined";
    return "status pending";
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (authLoading || !user) {
    return (
      <main className="dashboard-loading">
        <RefreshCw size={24} className="loading-icon" />
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <p className="welcome-label">Student Dashboard</p>

            <h1>
              Welcome back, <span>{user.name}</span>
            </h1>

            <p className="welcome-description">
              {user.department} • Manage your projects, discover engineering
              work, and stay connected with your peers.
            </p>
          </div>

          <div className="welcome-actions">
            <Link href="/projects/upload" className="primary-action">
              <Upload size={17} />
              Upload Project
            </Link>

            <Link href="/projects" className="secondary-action">
              <Search size={17} />
              Browse Projects
            </Link>
          </div>
        </section>

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card stat-cyan">
            <div className="stat-icon">
              <FolderKanban size={20} />
            </div>

            <div className="stat-content">
              <p>My Projects</p>
              <strong>
                {loading ? "—" : stats?.uploaded_projects_count ?? 0}
              </strong>
            </div>
          </div>

          <div className="stat-card stat-purple">
            <div className="stat-icon">
              <Send size={20} />
            </div>

            <div className="stat-content">
              <p>Requests Sent</p>
              <strong>
                {loading ? "—" : stats?.sent_requests_count ?? 0}
              </strong>
            </div>
          </div>

          <div className="stat-card stat-emerald">
            <div className="stat-icon">
              <Inbox size={20} />
            </div>

            <div className="stat-content">
              <p>Requests Received</p>
              <strong>
                {loading ? "—" : stats?.received_requests_count ?? 0}
              </strong>
            </div>
          </div>

          <div className="stat-card stat-amber">
            <div className="stat-icon">
              <Clock3 size={20} />
            </div>

            <div className="stat-content">
              <p>Pending Requests</p>
              <strong>
                {loading ? "—" : stats?.pending_requests_count ?? 0}
              </strong>
            </div>
          </div>

        </section>

        {/* Main Grid */}
        <section className="dashboard-grid">

          {/* Recent Projects */}
          <div className="dashboard-card projects-card">
            <div className="card-header">
              <div>
                <p className="section-kicker">Your work</p>
                <h2>Recent Projects</h2>
              </div>

              <Link href="/projects/my-projects" className="view-all">
                View all
                <ArrowRight size={15} />
              </Link>
            </div>

            {loading ? (
              <div className="empty-state">
                <RefreshCw size={22} className="loading-icon" />
                <p>Loading projects...</p>
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="empty-state">
                <FolderKanban size={28} />

                <h3>No projects yet</h3>

                <p>
                  Share your first engineering project with the ProjectForge
                  community.
                </p>

                <Link href="/projects/upload" className="small-action">
                  Upload your first project
                  <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="project-list">
                {recentProjects.map((project, index) => (
                  <Link
                    href={`/projects/${project.id}`}
                    key={project.id}
                    className={`project-item project-item-${index % 3}`}
                  >
                    <div className="project-item-main">

                      <span className="project-category">
                        {project.category}
                      </span>

                      <h3>{project.title}</h3>

                      <p>
                        {project.description.length > 110
                          ? `${project.description.slice(0, 110)}...`
                          : project.description}
                      </p>

                      <div className="project-tech">
                        {project.tech_stack}
                      </div>

                    </div>

                    <div className="project-arrow-box">
                      <ArrowRight size={18} className="project-arrow" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card quick-card">

            <div className="card-header">
              <div>
                <p className="section-kicker">Shortcuts</p>
                <h2>Quick Actions</h2>
              </div>
            </div>

            <div className="quick-actions">

              <Link
                href="/projects/upload"
                className="quick-action quick-cyan"
              >
                <div className="quick-icon">
                  <Upload size={19} />
                </div>

                <div>
                  <strong>Upload Project</strong>
                  <span>Share your latest work</span>
                </div>

                <ArrowRight size={16} />
              </Link>

              <Link
                href="/projects/my-projects"
                className="quick-action quick-purple"
              >
                <div className="quick-icon">
                  <FolderKanban size={19} />
                </div>

                <div>
                  <strong>My Projects</strong>
                  <span>Manage your projects</span>
                </div>

                <ArrowRight size={16} />
              </Link>

              <Link
                href="/projects"
                className="quick-action quick-emerald"
              >
                <div className="quick-icon">
                  <Search size={19} />
                </div>

                <div>
                  <strong>Browse Projects</strong>
                  <span>Discover student work</span>
                </div>

                <ArrowRight size={16} />
              </Link>

              <Link
                href="/profile"
                className="quick-action quick-amber"
              >
                <div className="quick-icon">
                  <UserRound size={19} />
                </div>

                <div>
                  <strong>My Profile</strong>
                  <span>Update your information</span>
                </div>

                <ArrowRight size={16} />
              </Link>

            </div>
          </div>

        </section>

        {/* Request Activity */}
        <section className="dashboard-card activity-card">

          <div className="card-header">
            <div>
              <p className="section-kicker">Collaboration</p>
              <h2>Recent Request Activity</h2>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <RefreshCw size={22} className="loading-icon" />
              <p>Loading activity...</p>
            </div>
          ) : requestActivity.length === 0 ? (
            <div className="empty-state compact">
              <Inbox size={28} />

              <h3>No request activity yet</h3>

              <p>
                Help requests connected to your projects will appear here.
              </p>
            </div>
          ) : (
            <div className="activity-list">

              {requestActivity.map((request) => {
                const isSent = request.user_id === user.id;

                return (
                  <div className="activity-item" key={request.id}>

                    <div
                      className={`activity-icon ${
                        isSent ? "activity-sent" : "activity-received"
                      }`}
                    >
                      {isSent ? (
                        <Send size={17} />
                      ) : (
                        <Inbox size={17} />
                      )}
                    </div>

                    <div className="activity-content">

                      <div className="activity-title-row">
                        <h3>{request.title}</h3>

                        <span className={getStatusClass(request.status)}>
                          {getStatusIcon(request.status)}
                          {request.status}
                        </span>
                      </div>

                      <p>
                        {isSent
                          ? `You submitted this help request on ${formatDate(
                              request.created_at
                            )}.`
                          : `A student requested help with your project on ${formatDate(
                              request.created_at
                            )}.`}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

      </div>

      <style jsx>{`

        /* ================================
           MAIN DASHBOARD
        ================================= */

        .dashboard-page {
          min-height: calc(100vh - 72px);
          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(56, 189, 248, 0.07),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 15%,
              rgba(99, 102, 241, 0.08),
              transparent 30%
            ),
            var(--bg-dark);
          padding: 2.5rem 1.5rem 4rem;
        }

        .dashboard-container {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        /* ================================
           LOADING
        ================================= */

        .dashboard-loading {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: var(--text-muted);
          background: var(--bg-dark);
        }

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

        /* ================================
           WELCOME SECTION
        ================================= */

        .welcome-section {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
          margin-bottom: 1.5rem;

          background:
            linear-gradient(
              135deg,
              rgba(56, 189, 248, 0.11),
              rgba(99, 102, 241, 0.10) 48%,
              rgba(192, 132, 252, 0.09)
            ),
            rgba(17, 24, 39, 0.72);

          border: 1px solid rgba(56, 189, 248, 0.22);
          border-radius: 18px;

          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);

          box-shadow:
            0 10px 35px rgba(0, 0, 0, 0.28),
            0 0 30px rgba(56, 189, 248, 0.06);

          overflow: hidden;
        }

        .welcome-section::before {
          content: "";
          position: absolute;
          width: 260px;
          height: 260px;
          top: -150px;
          right: 100px;

          background: rgba(99, 102, 241, 0.14);
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        .welcome-section::after {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          bottom: -150px;
          left: 20%;

          background: rgba(56, 189, 248, 0.10);
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        .welcome-content {
          position: relative;
          z-index: 1;
        }

        .welcome-label,
        .section-kicker {
          margin: 0 0 0.35rem;
          color: var(--primary-cyan);
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .welcome-section h1 {
          margin: 0;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          line-height: 1.15;
          color: var(--text-main);
        }

        .welcome-section h1 span {
          background: linear-gradient(
            135deg,
            var(--primary-cyan),
            #818cf8,
            #c084fc
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-description {
          max-width: 680px;
          margin: 0.7rem 0 0;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .welcome-actions {
          position: relative;
          z-index: 1;

          display: flex;
          flex-wrap: wrap;
          gap: 0.7rem;
          flex-shrink: 0;
        }

        /* ================================
           BUTTONS
        ================================= */

        .primary-action,
        .secondary-action,
        .small-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;

          text-decoration: none;
          border-radius: 9px;
          font-weight: 700;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease,
            opacity 0.2s ease;
        }

        .primary-action {
          padding: 0.75rem 1rem;
          background: linear-gradient(
            135deg,
            #0284c7,
            #4f46e5
          );
          color: #ffffff;
          border: 1px solid rgba(125, 211, 252, 0.35);

          box-shadow:
            0 6px 20px rgba(37, 99, 235, 0.22);
        }

        .primary-action:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 25px rgba(56, 189, 248, 0.28);
        }

        .secondary-action {
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-color);
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.045);
        }

        .secondary-action:hover {
          transform: translateY(-2px);
          border-color: rgba(56, 189, 248, 0.4);
          background: rgba(56, 189, 248, 0.07);
        }

        /* ================================
           STATISTICS
        ================================= */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          position: relative;

          display: flex;
          align-items: center;
          gap: 0.85rem;

          padding: 1.15rem;

          background: rgba(17, 24, 39, 0.68);
          border: 1px solid var(--border-color);
          border-radius: 14px;

          backdrop-filter: blur(9px);
          -webkit-backdrop-filter: blur(9px);

          overflow: hidden;

          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .stat-card::after {
          content: "";
          position: absolute;
          width: 90px;
          height: 90px;
          right: -35px;
          top: -40px;
          border-radius: 50%;
          filter: blur(25px);
          opacity: 0.18;
          transition: opacity 0.25s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
        }

        .stat-card:hover::after {
          opacity: 0.32;
        }

        .stat-cyan {
          border-color: rgba(56, 189, 248, 0.22);
        }

        .stat-cyan:hover {
          border-color: rgba(56, 189, 248, 0.55);
          box-shadow: 0 10px 30px rgba(56, 189, 248, 0.10);
        }

        .stat-cyan::after {
          background: var(--primary-cyan);
        }

        .stat-purple {
          border-color: rgba(192, 132, 252, 0.22);
        }

        .stat-purple:hover {
          border-color: rgba(192, 132, 252, 0.55);
          box-shadow: 0 10px 30px rgba(192, 132, 252, 0.10);
        }

        .stat-purple::after {
          background: #c084fc;
        }

        .stat-emerald {
          border-color: rgba(52, 211, 153, 0.22);
        }

        .stat-emerald:hover {
          border-color: rgba(52, 211, 153, 0.55);
          box-shadow: 0 10px 30px rgba(52, 211, 153, 0.10);
        }

        .stat-emerald::after {
          background: var(--accent-emerald);
        }

        .stat-amber {
          border-color: rgba(251, 191, 36, 0.22);
        }

        .stat-amber:hover {
          border-color: rgba(251, 191, 36, 0.55);
          box-shadow: 0 10px 30px rgba(251, 191, 36, 0.10);
        }

        .stat-amber::after {
          background: var(--accent-amber);
        }

        .stat-icon,
        .quick-icon,
        .activity-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon {
          position: relative;
          z-index: 1;

          width: 42px;
          height: 42px;
          border-radius: 10px;

          background: rgba(15, 23, 42, 0.75);
          border: 1px solid var(--border-color);
        }

        .stat-cyan .stat-icon {
          color: var(--primary-cyan);
          border-color: rgba(56, 189, 248, 0.28);
          background: rgba(56, 189, 248, 0.09);
        }

        .stat-purple .stat-icon {
          color: #c084fc;
          border-color: rgba(192, 132, 252, 0.28);
          background: rgba(192, 132, 252, 0.09);
        }

        .stat-emerald .stat-icon {
          color: var(--accent-emerald);
          border-color: rgba(52, 211, 153, 0.28);
          background: rgba(52, 211, 153, 0.09);
        }

        .stat-amber .stat-icon {
          color: var(--accent-amber);
          border-color: rgba(251, 191, 36, 0.28);
          background: rgba(251, 191, 36, 0.09);
        }

        .stat-content {
          position: relative;
          z-index: 1;
        }

        .stat-card p {
          margin: 0 0 0.15rem;
          color: var(--text-muted);
          font-size: 0.78rem;
          font-weight: 600;
        }

        .stat-card strong {
          font-size: 1.45rem;
          color: var(--text-main);
        }

        /* ================================
           MAIN GRID
        ================================= */

        .dashboard-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.65fr)
            minmax(300px, 0.85fr);

          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        /* ================================
           GLASS CARDS
        ================================= */

        .dashboard-card {
          background: rgba(17, 24, 39, 0.64);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;

          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);

          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.18);

          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .dashboard-card:hover {
          border-color: rgba(56, 189, 248, 0.22);
          box-shadow:
            0 14px 35px rgba(0, 0, 0, 0.25),
            0 0 18px rgba(56, 189, 248, 0.045);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;

          padding: 1.35rem 1.4rem;

          border-bottom: 1px solid var(--border-color);

          background: rgba(255, 255, 255, 0.018);
        }

        .card-header h2 {
          margin: 0;
          color: var(--text-main);
          font-size: 1.15rem;
        }

        .view-all {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;

          color: var(--primary-cyan);
          text-decoration: none;

          font-size: 0.82rem;
          font-weight: 700;
          white-space: nowrap;

          transition:
            gap 0.2s ease,
            color 0.2s ease;
        }

        .view-all:hover {
          gap: 0.5rem;
          color: #7dd3fc;
        }

        /* ================================
           PROJECTS
        ================================= */

        .project-list {
          display: flex;
          flex-direction: column;
        }

        .project-item {
          position: relative;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;

          padding: 1.2rem 1.4rem;

          color: inherit;
          text-decoration: none;

          border-bottom: 1px solid var(--border-color);

          transition:
            background 0.25s ease,
            padding-left 0.25s ease;
        }

        .project-item:last-child {
          border-bottom: 0;
        }

        .project-item:hover {
          background: rgba(56, 189, 248, 0.045);
          padding-left: 1.55rem;
        }

        .project-item-main {
          min-width: 0;
        }

        .project-category {
          display: inline-block;

          margin-bottom: 0.35rem;
          padding: 0.23rem 0.5rem;

          border-radius: 999px;

          font-size: 0.68rem;
          font-weight: 800;

          color: var(--primary-cyan);
          background: rgba(56, 189, 248, 0.09);
          border: 1px solid rgba(56, 189, 248, 0.18);
        }

        .project-item-1 .project-category {
          color: #c084fc;
          background: rgba(192, 132, 252, 0.09);
          border-color: rgba(192, 132, 252, 0.18);
        }

        .project-item-2 .project-category {
          color: var(--accent-emerald);
          background: rgba(52, 211, 153, 0.09);
          border-color: rgba(52, 211, 153, 0.18);
        }

        .project-item h3 {
          margin: 0;
          color: var(--text-main);
          font-size: 0.98rem;
        }

        .project-item p {
          margin: 0.35rem 0;
          color: var(--text-muted);
          font-size: 0.82rem;
          line-height: 1.45;
        }

        .project-tech {
          color: var(--text-subtle);
          font-size: 0.72rem;
          font-family: var(--font-mono);
          font-weight: 500;
        }

        .project-arrow-box {
          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 9px;

          background: rgba(255, 255, 255, 0.035);
          border: 1px solid var(--border-color);

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .project-arrow {
          color: var(--text-subtle);
        }

        .project-item:hover .project-arrow-box {
          transform: translateX(2px);
          background: rgba(56, 189, 248, 0.10);
          border-color: rgba(56, 189, 248, 0.28);
        }

        .project-item:hover .project-arrow {
          color: var(--primary-cyan);
        }

        /* ================================
           QUICK ACTIONS
        ================================= */

        .quick-actions {
          padding: 0.45rem;
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          padding: 0.85rem;

          margin-bottom: 0.25rem;

          border-radius: 10px;

          color: inherit;
          text-decoration: none;

          border: 1px solid transparent;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .quick-action:hover {
          transform: translateX(2px);
        }

        .quick-icon {
          width: 38px;
          height: 38px;
          border-radius: 9px;
        }

        .quick-action > div:nth-child(2) {
          flex: 1;
          min-width: 0;
        }

        .quick-action strong,
        .quick-action span {
          display: block;
        }

        .quick-action strong {
          color: var(--text-main);
          font-size: 0.84rem;
        }

        .quick-action span {
          margin-top: 0.15rem;
          color: var(--text-muted);
          font-size: 0.72rem;
        }

        .quick-action > svg:last-child {
          color: var(--text-subtle);
          transition: transform 0.2s ease;
        }

        .quick-action:hover > svg:last-child {
          transform: translateX(3px);
        }

        .quick-cyan:hover {
          background: rgba(56, 189, 248, 0.055);
          border-color: rgba(56, 189, 248, 0.16);
        }

        .quick-cyan .quick-icon {
          color: var(--primary-cyan);
          background: rgba(56, 189, 248, 0.09);
          border: 1px solid rgba(56, 189, 248, 0.20);
        }

        .quick-purple:hover {
          background: rgba(192, 132, 252, 0.055);
          border-color: rgba(192, 132, 252, 0.16);
        }

        .quick-purple .quick-icon {
          color: #c084fc;
          background: rgba(192, 132, 252, 0.09);
          border: 1px solid rgba(192, 132, 252, 0.20);
        }

        .quick-emerald:hover {
          background: rgba(52, 211, 153, 0.055);
          border-color: rgba(52, 211, 153, 0.16);
        }

        .quick-emerald .quick-icon {
          color: var(--accent-emerald);
          background: rgba(52, 211, 153, 0.09);
          border: 1px solid rgba(52, 211, 153, 0.20);
        }

        .quick-amber:hover {
          background: rgba(251, 191, 36, 0.055);
          border-color: rgba(251, 191, 36, 0.16);
        }

        .quick-amber .quick-icon {
          color: var(--accent-amber);
          background: rgba(251, 191, 36, 0.09);
          border: 1px solid rgba(251, 191, 36, 0.20);
        }

        /* ================================
           EMPTY STATES
        ================================= */

        .empty-state {
          min-height: 220px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          text-align: center;

          padding: 2rem;

          color: var(--text-muted);
        }

        .empty-state h3 {
          margin: 0.75rem 0 0.25rem;
          color: var(--text-main);
          font-size: 1rem;
        }

        .empty-state p {
          max-width: 390px;
          margin: 0;

          font-size: 0.82rem;
          line-height: 1.5;
        }

        .empty-state.compact {
          min-height: 170px;
        }

        .small-action {
          margin-top: 1rem;
          padding: 0.65rem 0.85rem;

          background: rgba(56, 189, 248, 0.07);
          border: 1px solid rgba(56, 189, 248, 0.20);

          color: var(--primary-cyan);

          font-size: 0.78rem;
        }

        .small-action:hover {
          background: rgba(56, 189, 248, 0.12);
          border-color: rgba(56, 189, 248, 0.35);
        }

        /* ================================
           ACTIVITY
        ================================= */

        .activity-card {
          margin-bottom: 1rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;

          padding: 1.05rem 1.4rem;

          border-bottom: 1px solid var(--border-color);

          transition: background 0.2s ease;
        }

        .activity-item:last-child {
          border-bottom: 0;
        }

        .activity-item:hover {
          background: rgba(255, 255, 255, 0.018);
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
        }

        .activity-sent {
          color: #c084fc;
          background: rgba(192, 132, 252, 0.09);
          border: 1px solid rgba(192, 132, 252, 0.20);
        }

        .activity-received {
          color: var(--primary-cyan);
          background: rgba(56, 189, 248, 0.09);
          border: 1px solid rgba(56, 189, 248, 0.20);
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .activity-title-row h3 {
          margin: 0;
          color: var(--text-main);
          font-size: 0.9rem;
        }

        .activity-content p {
          margin: 0.3rem 0 0;
          color: var(--text-muted);
          font-size: 0.78rem;
        }

        /* ================================
           STATUS BADGES
        ================================= */

        .status {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;

          padding: 0.28rem 0.55rem;

          border-radius: 999px;

          font-size: 0.68rem;
          font-weight: 800;

          white-space: nowrap;
        }

        .status.pending {
          background: rgba(251, 191, 36, 0.10);
          color: var(--accent-amber);
          border: 1px solid rgba(251, 191, 36, 0.20);
        }

        .status.accepted {
          background: rgba(52, 211, 153, 0.10);
          color: var(--accent-emerald);
          border: 1px solid rgba(52, 211, 153, 0.20);
        }

        .status.declined {
          background: rgba(244, 63, 94, 0.10);
          color: var(--accent-rose);
          border: 1px solid rgba(244, 63, 94, 0.20);
        }

        /* ================================
           RESPONSIVE
        ================================= */

        @media (max-width: 900px) {
          .welcome-section {
            align-items: flex-start;
            flex-direction: column;
          }

          .welcome-actions {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .dashboard-page {
            padding: 1.5rem 1rem 3rem;
          }

          .welcome-section {
            padding: 1.4rem;
          }

          .welcome-actions {
            width: 100%;
          }

          .primary-action,
          .secondary-action {
            flex: 1;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.7rem;
          }

          .stat-card {
            padding: 0.9rem;
          }

          .stat-icon {
            width: 36px;
            height: 36px;
          }

          .stat-card strong {
            font-size: 1.25rem;
          }

          .card-header {
            padding: 1.1rem;
          }

          .project-item,
          .activity-item {
            padding: 1rem 1.1rem;
          }

          .activity-title-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 0.4rem;
          }

          .project-arrow-box {
            width: 30px;
            height: 30px;
          }
        }

      `}</style>
    </main>
  );
}