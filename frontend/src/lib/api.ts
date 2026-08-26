export interface User {
  id: number;
  full_name: string;
  name?: string;
  email: string;
  department: string;
  bio?: string;
  demonstrated_skills?: string[] | string;
  created_at?: string;
}

export interface ProjectAuthor {
  id: number;
  name: string;
  email: string;
  department: string;
  bio?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;

  // Backend currently uses technologies.
  // Keep the older tech_stack field optional for compatibility.
  technologies: string;
  tech_stack?: string;

  // Backend currently uses github_link / demo_link.
  github_link?: string;
  demo_link?: string;

  // Keep older names optional for compatibility.
  github_url?: string;
  demo_url?: string;

  user_id: number;

  author?: ProjectAuthor;
  user?: ProjectAuthor;

  created_at: string;
}

export interface HelpRequest {
  id: number;
  title?: string;
  description?: string;
  category?: string;

  status: "Pending" | "Accepted" | "Declined";

  project_id?: number;
  user_id?: number;
  helper_id?: number;

  requester_id?: number;
  recipient_id?: number;

  message: string;

  created_at: string;

  project_title?: string;

  helper?: {
    id: number;
    name?: string;
    full_name?: string;
    email: string;
    department: string;
  };

  user?: {
    id: number;
    name?: string;
    full_name?: string;
    email: string;
    department: string;
  };

  requester?: {
    id: number;
    name?: string;
    full_name?: string;
    email: string;
    department: string;
  };

  recipient?: {
    id: number;
    name?: string;
    full_name?: string;
    email: string;
    department: string;
  };
}

// =====================================================
// API URL
// =====================================================
//
// On Vercel, create:
//
// NEXT_PUBLIC_API_URL=https://YOUR-RENDER-BACKEND.onrender.com
//
// Do NOT add /api at the end.
//
// Local development falls back to localhost.
// =====================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";


// =====================================================
// MAIN API FETCH FUNCTION
// =====================================================

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

  // DELETE requests may return no body.
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}


// =====================================================
// TOKEN MANAGEMENT
// =====================================================

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


// =====================================================
// PROJECT API
// =====================================================

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
    `/projects${query ? `?${query}` : ""}`
  );
}


export async function getProject(
  projectId: number
): Promise<Project> {
  return apiFetch<Project>(
    `/projects/${projectId}`
  );
}


export async function getMyProjects(): Promise<Project[]> {
  return apiFetch<Project[]>(
    "/projects/me"
  );
}


// =====================================================
// HELP REQUEST API
// =====================================================

export async function getHelpRequests(
  category?: string
): Promise<HelpRequest[]> {
  const params = new URLSearchParams();

  if (category && category !== "All") {
    params.set("category", category);
  }

  const query = params.toString();

  return apiFetch<HelpRequest[]>(
    `/requests${query ? `?${query}` : ""}`
  );
}


// =====================================================
// AUTH API
// =====================================================

export async function getCurrentUser(): Promise<User> {
  return apiFetch<User>("/auth/me");
}
