import { apiRequest } from "./client.js";

export async function loginUser(credentials) {
  const response = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });

  return response.data;
}

