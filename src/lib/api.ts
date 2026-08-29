/**
 * lib/api.ts
 * Centralised API helpers for Campus Sphere.
 */

export const QUERY_KEYS = {
  profile: ["profile"] as const,
  events: ["events"] as const,
  event: (id: string) => ["events", id] as const,
  jobs: (location: string, experience: string) => ["jobs", location, experience] as const,
  groups: ["groups"] as const,
  chats: ["chats"] as const,
  messages: (chatId: string) => ["messages", chatId] as const,
  users: (search: string) => ["users", "search", search] as const,
};

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const fetchProfile = () => apiFetch("/api/user/profile");
export const fetchEvents = () => apiFetch("/api/events");
export const fetchJobs = (location = "India", experience = "fresher") =>
  apiFetch(`/api/jobs?location=${encodeURIComponent(location)}&experience=${encodeURIComponent(experience)}`);
export const fetchGroups = () => apiFetch("/api/groups");
export const fetchChats = () => apiFetch("/api/chat");
export const fetchMessages = (chatId: string) => apiFetch(`/api/chat/${chatId}/messages`);
export const searchUsers = (query: string) =>
  apiFetch(`/api/users/search?search=${encodeURIComponent(query)}`);
export const joinGroup = (groupId: string) =>
  apiFetch(`/api/groups/${groupId}/join`, { method: "POST" });
export const leaveGroup = (groupId: string) =>
  apiFetch(`/api/groups/${groupId}/join`, { method: "DELETE" });
export const sendMessage = (chatId: string, content: string) =>
  apiFetch(`/api/chat/${chatId}/messages`, { method: "POST", body: JSON.stringify({ content }) });
export const startChat = (userId: string) =>
  apiFetch("/api/chat", { method: "POST", body: JSON.stringify({ userId }) });
export const createPublicGroup = (data: { chatName: string; description: string; category: string }) =>
  apiFetch("/api/groups", { method: "POST", body: JSON.stringify(data) });
export const registerEvent = (eventId: string) =>
  apiFetch(`/api/events/${eventId}/register`, { method: "POST" });
export const updateProfile = (data: Record<string, any>) =>
  apiFetch("/api/user/profile", { method: "PUT", body: JSON.stringify(data) });
