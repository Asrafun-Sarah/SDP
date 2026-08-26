export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  bio?: string;
  demonstrated_skills?: string;
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  tech_stack: string;
  github_url?: string;
  demo_url?: string;
  user_id: number;
  created_at: string;
  owner: User;
}

export interface HelpRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string; // Pending, Accepted, Declined, Completed
  project_id?: number;
  user_id: number;
  helper_id?: number;
  created_at: string;
  author: User;
  helper?: User;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "An error occurred" }));
    throw new Error(errorData.detail || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}
