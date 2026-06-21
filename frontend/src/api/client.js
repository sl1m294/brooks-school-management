const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
export const AUTH_EXPIRED_EVENT = "sms_auth_expired";

export class ApiClientError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest(path, options = {}) {
  const token = window.localStorage.getItem("sms_access_token");
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      window.localStorage.removeItem("sms_access_token");
      window.localStorage.removeItem("sms_refresh_token");
      window.localStorage.removeItem("sms_user");
      window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }

    throw new ApiClientError(
      body?.error?.message ?? "Something went wrong",
      response.status,
      body?.error?.details
    );
  }

  return body;
}
