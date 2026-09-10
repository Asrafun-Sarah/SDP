"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Cpu,
  Search,
  LogIn,
  UserPlus,
  LayoutDashboard,
  UserRound,
  FolderKanban,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMobileMenuOpen(false);
    window.location.href = "/login";
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <>
      <nav className="projectforge-navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <Link
            href="/"
            className="brand"
            onClick={closeMobileMenu}
          >
            <div className="brand-icon">
              <Cpu size={21} strokeWidth={2.2} />
            </div>

            <span className="brand-text">
              Project<span>Forge</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            {/* Home */}
            <Link
              href={user ? "/home" : "/"}
              className="nav-link active"
            >
              Home
            </Link>

            {/* Everyone */}
            <Link
              href="/projects"
              className="nav-link"
            >
              Projects
            </Link>

            {/* Logged-out only */}
            {!user && (
              <Link
                href="/projects"
                className="nav-link"
              >
                Categories
              </Link>
            )}

            {/* Logged-in only */}
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="nav-link"
                >
                  Dashboard
                </Link>

                <Link
                  href="/projects/my-projects"
                  className="nav-link"
                >
                  My Projects
                </Link>

                <Link
                  href="/profile"
                  className="nav-link"
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="desktop-actions">
            <div className="search-box">
              <Search size={15} />

              <input
                type="text"
                placeholder="Search projects, technologies, or keywords..."
                aria-label="Search projects"
              />
            </div>

            {user ? (
              <div className="logged-actions">
                <button
                  onClick={handleLogout}
                  className="logout-button"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-actions">
                <Link
                  href="/login"
                  className="login-link"
                >
                  <LogIn size={16} />
                  Login
                </Link>

                <Link
                  href="/register"
                  className="register-button"
                >
                  <UserPlus size={16} />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            {/* Home */}
            <Link
              href={user ? "/home" : "/"}
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            {/* Everyone */}
            <Link
              href="/projects"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              Projects
            </Link>

            {/* Logged-out only */}
            {!user && (
              <Link
                href="/projects"
                className="mobile-nav-link"
                onClick={closeMobileMenu}
              >
                Categories
              </Link>
            )}

            <div className="mobile-search">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search projects..."
                aria-label="Search projects"
              />
            </div>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                <Link
                  href="/projects/my-projects"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  <FolderKanban size={16} />
                  My Projects
                </Link>

                <Link
                  href="/profile"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  <UserRound size={16} />
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="mobile-logout"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div className="mobile-auth">
                <Link
                  href="/login"
                  className="mobile-login"
                  onClick={closeMobileMenu}
                >
                  <LogIn size={16} />
                  Login
                </Link>

                <Link
                  href="/register"
                  className="mobile-register"
                  onClick={closeMobileMenu}
                >
                  <UserPlus size={16} />
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <style jsx>{`
        .projectforge-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(5, 12, 27, 0.88);
          border-bottom: 1px solid rgba(71, 85, 105, 0.28);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .navbar-inner {
          width: min(1180px, calc(100% - 40px));
          height: 68px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .brand-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #38bdf8;
          background: rgba(14, 165, 233, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.28);
          box-shadow: 0 0 18px rgba(14, 165, 233, 0.1);
        }

        .brand-text {
          color: #f8fafc;
          font-size: 1.08rem;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .brand-text span {
          color: #38bdf8;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 5px;
          height: 100%;
        }

        .nav-link {
          position: relative;
          display: flex;
          align-items: center;
          height: 100%;
          padding: 0 13px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.84rem;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #f8fafc;
        }

        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 13px;
          right: 13px;
          height: 2px;
          border-radius: 2px;
          background: #38bdf8;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.6);
        }

        .desktop-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 18px;
          min-width: 0;
        }

        .search-box {
          width: 250px;
          height: 38px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          color: #64748b;
          background: rgba(15, 23, 42, 0.82);
          border: 1px solid rgba(71, 85, 105, 0.45);
          border-radius: 9px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .search-box:focus-within {
          border-color: rgba(56, 189, 248, 0.55);
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.08);
        }

        .search-box input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #e2e8f0;
          font-size: 0.72rem;
        }

        .search-box input::placeholder {
          color: #64748b;
        }

        .auth-actions,
        .logged-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .login-link,
        .nav-action-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #cbd5e1;
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 500;
          white-space: nowrap;
          transition: color 0.2s ease;
        }

        .login-link:hover,
        .nav-action-link:hover {
          color: #38bdf8;
        }

        .register-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 15px;
          border-radius: 8px;
          color: white;
          text-decoration: none;
          background: linear-gradient(
            135deg,
            #0ea5e9,
            #2563eb
          );
          border: 1px solid rgba(56, 189, 248, 0.4);
          font-size: 0.8rem;
          font-weight: 650;
          box-shadow:
            0 5px 18px rgba(37, 99, 235, 0.2);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .register-button:hover {
          transform: translateY(-1px);
          box-shadow:
            0 8px 24px rgba(37, 99, 235, 0.3);
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          color: #cbd5e1;
          background: rgba(30, 41, 59, 0.65);
          border: 1px solid rgba(71, 85, 105, 0.45);
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.8rem;
          cursor: pointer;
          transition:
            color 0.2s ease,
            border-color 0.2s ease;
        }

        .logout-button:hover {
          color: #f87171;
          border-color: rgba(248, 113, 113, 0.4);
        }

        .mobile-menu-button {
          display: none;
          margin-left: auto;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          color: #cbd5e1;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.4);
          border-radius: 8px;
          cursor: pointer;
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 1050px) {
          .desktop-nav {
            display: none;
          }

          .desktop-actions {
            display: none;
          }

          .mobile-menu-button {
            display: flex;
          }

          .mobile-menu {
            display: flex;
            flex-direction: column;
            gap: 4px;
            width: min(1180px, calc(100% - 40px));
            margin: 0 auto;
            padding: 12px 0 18px;
            border-top: 1px solid rgba(71, 85, 105, 0.22);
          }

          .mobile-nav-link {
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 12px 10px;
            color: #cbd5e1;
            text-decoration: none;
            border-radius: 8px;
            font-size: 0.9rem;
          }

          .mobile-nav-link:hover {
            color: #38bdf8;
            background: rgba(56, 189, 248, 0.06);
          }

          .mobile-search {
            height: 42px;
            display: flex;
            align-items: center;
            gap: 9px;
            margin: 8px 0;
            padding: 0 12px;
            color: #64748b;
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(71, 85, 105, 0.4);
            border-radius: 8px;
          }

          .mobile-search input {
            width: 100%;
            border: none;
            outline: none;
            background: transparent;
            color: #e2e8f0;
            font-family: inherit;
          }

          .mobile-auth {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 8px;
          }

          .mobile-login,
          .mobile-register,
          .mobile-logout {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            min-height: 40px;
            border-radius: 8px;
            text-decoration: none;
            font-family: inherit;
            font-size: 0.84rem;
            font-weight: 600;
          }

          .mobile-login {
            color: #cbd5e1;
            background: rgba(30, 41, 59, 0.65);
            border: 1px solid rgba(71, 85, 105, 0.45);
          }

          .mobile-register {
            color: white;
            background: linear-gradient(
              135deg,
              #0ea5e9,
              #2563eb
            );
            border: 1px solid rgba(56, 189, 248, 0.35);
          }

          .mobile-logout {
            width: 100%;
            color: #fca5a5;
            background: rgba(127, 29, 29, 0.12);
            border: 1px solid rgba(248, 113, 113, 0.25);
            cursor: pointer;
          }
        }

        @media (max-width: 500px) {
          .navbar-inner {
            width: calc(100% - 24px);
            height: 62px;
          }

          .brand-text {
            font-size: 1rem;
          }

          .brand-icon {
            width: 31px;
            height: 31px;
          }

          .mobile-menu {
            width: calc(100% - 24px);
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;