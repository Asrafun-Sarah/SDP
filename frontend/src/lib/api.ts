export interface User {
  id: number;
  full_name: string;
  email: string;
  department: string;
  bio?: string;
  demonstrated_skills?: string[] | string;
  created_at?: string;
}

export interface ProjectAuthor {
  id: number;
  full_name: string;
  email: string;
  department: string;
  bio?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string;
  github_link?: string;
  demo_link?: string;
  author_id: number;
  author: ProjectAuthor;
  created_at: string;
}

export interface HelpRequest {
  id: number;
  project_id: number;
  requester_id: number;
  recipient_id: number;
  message: string;
  status: "Pending" | "Accepted" | "Declined";
  created_at: string;
  project_title?: string;
  category?: string;
  author?: string;
  helper?: {
    id: number;
    full_name: string;
    email: string;
    department: string;
  };
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
  helper_id?: number;
}

const API_URL = "/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;

    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {}

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("pf_token", token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("pf_token");
  }

  return null;
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("pf_token");
  }
}

export async function getProjects(): Promise<Project[]> {
  return apiFetch<Project[]>("/projects");
}

export async function getHelpRequests(): Promise<HelpRequest[]> {
  return apiFetch<HelpRequest[]>("/helpRequests");
}

export async function getCurrentUser(): Promise<User> {
  return apiFetch<User>("/auth/me");
}
