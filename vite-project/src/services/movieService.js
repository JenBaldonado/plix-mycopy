import { tmdbFetch } from "../api/tmdb.js";

export async function getCategoryMovies(category = "trending") {
  const endpoints = {
    trending: "/trending/movie/week",
    popular: "/movie/popular",
    theaters: "/movie/now_playing",
    drama: "/discover/movie",
  };
  const parameters = { language: "en-US" };
  if (category === "drama") {
    Object.assign(parameters, { with_genres: 18, sort_by: "vote_average.desc", "vote_count.gte": 100 });
  }
  const data = await tmdbFetch(endpoints[category] || endpoints.trending, parameters);
  return data.results || [];
}

export function getHomeMovies() {
  return getCategoryMovies("trending");
}

export function getMovieDetails(movieId) {
  return tmdbFetch(`/movie/${movieId}`, { language: "en-US" });
}

export async function searchMovies(query) {
  const data = await tmdbFetch("/search/movie", {
    query, language: "en-US", include_adult: false,
  });
  return data.results || [];
}

export async function getMovieTrailer(movieId) {
  const data = await tmdbFetch(`/movie/${movieId}/videos`, { language: "en-US" });
  const videos = (data.results || []).filter(video => video.site === "YouTube");
  const trailer = videos.find(video => video.type === "Trailer" && video.official)
    || videos.find(video => video.type === "Trailer")
    || videos.find(video => video.type === "Teaser");
  return trailer?.key ?? null;
}
