"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch, getToken, removeToken, User } from "@/lib/api";
import {
  Cpu,
  Rocket,
  HelpCircle,
  LogIn,
  LogOut,
  User as UserIcon,
  PlusCircle,
  LayoutDashboard,
  FolderGit2,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkUser();
  }, [pathname]);

  async function checkUser() {
    const token = getToken();

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const userData = await apiFetch<User>("/auth/me");
      setUser(userData);
    } catch {
      removeToken();
      setUser(null);
    }
  }

  function handleLogout() {
    removeToken();
    setUser(null);
    router.push("/login");
  }

  const navLinks = [
    { name: "Browse Projects", href: "/projects", icon: Rocket },
    { name: "Help Board", href: "/help", icon: HelpCircle },
  ];

  if (user) {
    navLinks.push({
      name: "My Projects",
      href: "/my-projects",
      icon: FolderGit2,
    });
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Cpu className="w-5 h-5" />
            </div>

            <span className="font-bold text-lg tracking-tight text-white">
              ProjectForge
            </span>

            <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-slate-800 text-blue-400 border border-slate-700 rounded">
              University Project Hub
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-900/40 text-blue-300 border border-blue-700/50"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/projects/new"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Upload Project</span>
                </Link>

                <Link
                  href="/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    pathname === "/dashboard"
                      ? "border-blue-500 text-blue-400 bg-slate-800"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                  title="Student Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/profile"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    pathname === "/profile"
                      ? "border-blue-500 text-blue-400 bg-slate-800"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                  title="My Profile"
                >
                  <UserIcon className="w-4 h-4" />

                  <span className="hidden sm:inline">
                    {user.full_name.split(" ")[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
