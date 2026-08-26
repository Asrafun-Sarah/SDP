"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken, removeToken, User } from "@/lib/api";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getToken();

    if (token) {
      try {
        const payload = JSON.parse(
          atob(token.split(".")[1])
        ) as User;

        setUser(payload);
      } catch {
        setUser(null);
      }
    }
  }, []);

  function handleLogout() {
    removeToken();
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <nav>
      <Link href="/">ProjectForge</Link>

      <div>
        <Link href="/projects">Projects</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/profile">Profile</Link>

        {user ? (
          <>
            <span style={{ marginRight: "1rem" }}>
              {user.full_name}
            </span>

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
