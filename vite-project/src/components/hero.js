import {
  getBackdropUrl,
  getReleaseYear,
  formatRating,
} from "../utils/formatter.js";

export function renderHero(movie) {
  const hero = document.querySelector("#featured-hero");
  hero.querySelector(".hero-actions").hidden = !movie;
  hero.style.backgroundImage = movie?.backdrop_path
    ? `linear-gradient(90deg, #101318 0%, rgb(16 19 24 / 85%) 35%, rgb(16 19 24 / 20%) 100%), linear-gradient(0deg, #101318, transparent 50%), url("${getBackdropUrl(movie.backdrop_path)}")`
    : "";
  hero.querySelector("[data-hero-title]").textContent =
    movie?.title || "Discover something great.";
  hero.querySelector("[data-hero-overview]").textContent = movie
    ? movie.overview || "No description is currently available."
    : "Explore movies, discover favorites, and watch trailers with Plix.";
  hero.querySelector("[data-hero-year]").textContent = movie
    ? getReleaseYear(movie.release_date)
    : "";
  hero.querySelector("[data-hero-rating]").textContent = movie
    ? `\u2605 ${formatRating(movie.vote_average)}`
    : "";
  const trailer = hero.querySelector("[data-trailer-id]");
  trailer.dataset.trailerId = movie?.id || "";
  trailer.dataset.movieTitle = movie?.title || "";
  hero.querySelector("[data-more-info-id]").dataset.moreInfoId =
    movie?.id || "";
}
