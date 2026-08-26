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

  // Backend uses tech_stack
  tech_stack: string;

  // Backend uses these names
  github_url?: string;
  demo_url?: string;

  user_id: number;

  // Some API responses may include the author/user
  author?: ProjectAuthor;
  user?: ProjectAuthor;

  created_at: string;
}

export interface HelpRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "Pending" | "Accepted" | "Declined";

  project_id: number;
  user_id: number;

  helper_id?: number;

  created_at: string;

  helper?: {
    id: number;
    full_name: string;
    email: string;
    department: string;
  };

  user?: {
    id: number;
    full_name: string;
    email: string;
    department: string;
  };
}

// Deployed FastAPI backend
const API_URL = "https://projectforge-jlhb.onrender.com";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;

    try {
      const errorData = await response.json();

      message =
        errorData.detail ||
        errorData.message ||
        message;
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

// =========================
// TOKEN MANAGEMENT
// =========================

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

// =========================
// PROJECT API
// =========================

export async function getProjects(
  category?: string,
  search?: string
): Promise<Project[]> {
  const params = new URLSearchParams();

  if (category && category !== "All") {
    params.set("category", category);
  }

  if (search) {
    params.set("search", search);
  }

  const query = params.toString();

  return apiFetch<Project[]>(
    `/api/projects${query ? `?${query}` : ""}`
  );
}

export async function getProject(
  projectId: number
): Promise<Project> {
  return apiFetch<Project>(
    `/api/projects/${projectId}`
  );
}

export async function getMyProjects(): Promise<Project[]> {
  return apiFetch<Project[]>(
    "/api/projects/my-projects"
  );
}

// =========================
// HELP REQUEST API
// =========================

export async function getHelpRequests(
  category?: string
): Promise<HelpRequest[]> {
  const params = new URLSearchParams();

  if (category && category !== "All") {
    params.set("category", category);
  }

  const query = params.toString();

  return apiFetch<HelpRequest[]>(
    `/api/help-requests${query ? `?${query}` : ""}`
  );
}

// =========================
// AUTH API
// =========================

export async function getCurrentUser(): Promise<User> {
  return apiFetch<User>("/api/auth/me");
}
