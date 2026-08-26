import React from "react";
import Link from "next/link";
import { Cpu, FolderGit2, Globe, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer style={{ marginTop: "auto", borderTop: "1px solid var(--border-color)", background: "rgba(9, 13, 22, 0.9)", padding: "3rem 0 1.5rem 0" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2.5rem", marginBottom: "2.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Cpu size={22} color="var(--primary-cyan)" />
              <span style={{ fontSize: "1.15rem", fontWeight: 800 }} className="gradient-text">ProjectForge</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
              An engineering student project sharing and peer collaboration platform designed for discovery, skill showcase, and academic guidance.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.875rem" }}>Engineering Categories</h4>
            <ul style={{ listStyle: "none", color: "var(--text-muted)", fontSize: "0.875rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <li><Link href="/projects?category=Embedded+Systems">Embedded Systems & Microcontrollers</Link></li>
              <li><Link href="/projects?category=Robotics">Robotics & Autonomous Systems</Link></li>
              <li><Link href="/projects?category=Software">Software Engineering & Web</Link></li>
              <li><Link href="/projects?category=ML/AI">Machine Learning & Computer Vision</Link></li>
              <li><Link href="/projects?category=Mechanical/CAD">Mechanical & CAD Design</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.875rem" }}>Platform Features</h4>
            <ul style={{ listStyle: "none", color: "var(--text-muted)", fontSize: "0.875rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <li><Link href="/projects">Browse & Search Projects</Link></li>
              <li><Link href="/projects/upload">Share Your Project</Link></li>
              <li><Link href="/dashboard">Student Dashboard</Link></li>
              <li><Link href="/register">Create Student Account</Link></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", fontSize: "0.825rem", color: "var(--text-subtle)" }}>
          <p>© 2026 ProjectForge — Built for Engineering Students</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span>Crafted with</span>
            <Heart size={13} color="#f43f5e" fill="#f43f5e" />
            <span>using Next.js, FastAPI & SQLite</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
