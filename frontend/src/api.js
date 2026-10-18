// Connectivity layer: all HTTP requests to the Spring Boot REST API live here.
const BASE_URL = "http://localhost:8080/api";

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let text = `Request failed (${res.status})`;
    try { text = (await res.json()).message || text; } catch { /* no JSON body */ }
    throw new Error(text);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  list: (resource) => request(`/${resource}`),                                    // GET
  create: (resource, data) =>
    request(`/${resource}`, { method: "POST", body: JSON.stringify(data) }),      // POST
  update: (resource, id, data) =>
    request(`/${resource}/${id}`, { method: "PUT", body: JSON.stringify(data) }), // PUT
  remove: (resource, id) => request(`/${resource}/${id}`, { method: "DELETE" }),  // DELETE
};
