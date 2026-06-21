import { apiRequest } from "./client.js";

export async function listStudents(filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  });

  const query = params.toString();
  const response = await apiRequest(`/api/students${query ? `?${query}` : ""}`);
  return response;
}

export async function createStudent(student) {
  const response = await apiRequest("/api/students", {
    method: "POST",
    body: JSON.stringify(student)
  });

  return response.data;
}

export async function listStudentExamResults(studentId) {
  const response = await apiRequest(`/api/students/${studentId}/exam-results`);
  return response.data;
}
