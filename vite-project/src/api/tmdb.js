const BASE_URL = "https://api.themoviedb.org/3/";

export async function tmdbFetch(endpoint, parameters = {}) {
  const apiKey = import.meta.env.VITE_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Movie service is not configured. Set VITE_API_KEY in .env and restart Vite.");
  }

  const url = new URL(endpoint.replace(/^\/+/, ""), BASE_URL);
  url.searchParams.set("api_key", apiKey);
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  let response;
  try {
    response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error("Could not connect to the movie service. Check your connection and try again.");
  }
  if (!response.ok) {
    throw new Error(response.status === 401
      ? "The movie service rejected the API key. Check VITE_API_KEY and restart Vite."
      : "Movies are temporarily unavailable. Please try again.");
  }
  return response.json();
}
