"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Cpu, PlusCircle, FolderGit2, User, LogOut, LayoutDashboard, Menu, X, Search } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="glass-panel" style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-color)" }}>
      <div className="container" style={{ height: "4.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{
            width: "2.25rem",
            height: "2.25rem",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px rgba(56, 189, 248, 0.4)"
          }}>
            <Cpu size={20} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em" }} className="gradient-text">
              ProjectForge
            </span>
            <span style={{ fontSize: "0.65rem", display: "block", color: "var(--text-muted)", marginTop: "-3px", fontWeight: 500 }}>
              Engineering Resource Hub
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }} className="desktop-nav">
          <Link
            href="/projects"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.9rem",
              fontWeight: 500,
              color: isActive("/projects") ? "var(--primary-cyan)" : "var(--text-muted)",
              transition: "color 0.2s ease"
            }}
          >
            <Search size={16} />
            Browse Projects
          </Link>

          {user && (
            <>
              <Link
                href="/dashboard"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: isActive("/dashboard") ? "var(--primary-cyan)" : "var(--text-muted)",
                  transition: "color 0.2s ease"
                }}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link
                href="/projects/upload"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: isActive("/projects/upload") ? "var(--primary-cyan)" : "var(--text-muted)",
                  transition: "color 0.2s ease"
                }}
              >
                <PlusCircle size={16} />
                Upload Project
              </Link>
              <Link
                href="/projects/my-projects"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: isActive("/projects/my-projects") ? "var(--primary-cyan)" : "var(--text-muted)",
                  transition: "color 0.2s ease"
                }}
              >
                <FolderGit2 size={16} />
                My Projects
              </Link>
            </>
          )}
        </nav>

        {/* User Auth Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link
                href={`/profile/${user.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--border-color)",
                  fontSize: "0.875rem",
                  fontWeight: 500
                }}
              >
                <User size={15} color="var(--primary-cyan)" />
                <span>{user.full_name}</span>
              </Link>
              <button
                onClick={logout}
                title="Logout"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "0.375rem",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link href="/login" className="btn-secondary" style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
                Log In
              </Link>
              <Link href="/register" className="btn-primary" style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
