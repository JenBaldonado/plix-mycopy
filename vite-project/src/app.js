import { getCategoryMovies, searchMovies, getMovieTrailer, getMovieDetails } from "./services/movieService.js";
import { renderHeader } from "./components/header.js";
import { renderHero } from "./components/hero.js";
import { renderMovieGrid } from "./components/movieGrid.js";
import { openMovieModal, showTrailer, showMovieDetails, showModalMessage } from "./components/trailerModal.js";
import { debounce } from "./utils/debounce.js";

const headings = { trending: "Trending This Week", popular: "Popular Movies", drama: "Highly Rated Drama", theaters: "Now In Theaters" };

export async function initializeApp() {
  renderHeader();
  const searchInput = document.querySelector("#movie-search");
  const grid = document.querySelector("#trending-grid");
  const heading = document.querySelector("#movies-heading");
  const count = document.querySelector("#movie-count");
  let category = getCategory();
  let requestId = 0;

  function getCategory() {
    const value = window.location.hash.slice(1);
    return Object.hasOwn(headings, value) ? value : "trending";
  }

  async function loadMovies() {
    const currentRequest = ++requestId;
    const query = searchInput.value.trim();
    heading.textContent = query ? `Results for "${query}"` : headings[category];
    count.textContent = "";
    grid.setAttribute("aria-busy", "true");
    grid.innerHTML = '<p class="status-message" role="status">Loading movies...</p>';
    document.querySelectorAll("[data-category]").forEach(link => {
      const active = !query && link.dataset.category === category;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    try {
      const movies = query ? await searchMovies(query) : await getCategoryMovies(category);
      if (currentRequest !== requestId) return;
      renderMovieGrid(grid, movies);
      count.textContent = `${movies.length} ${movies.length === 1 ? "movie" : "movies"}`;
      if (!query) renderHero(movies[0]);
    } catch (error) {
      if (currentRequest !== requestId) return;
      if (!query) renderHero(null);
      const message = document.createElement("div");
      message.className = "status-message";
      message.setAttribute("role", "alert");
      const text = document.createElement("p");
      text.textContent = error.message;
      const retry = document.createElement("button");
      retry.className = "button button-secondary";
      retry.textContent = "Try again";
      retry.addEventListener("click", loadMovies);
      message.append(text, retry);
      grid.replaceChildren(message);
    } finally {
      if (currentRequest === requestId) grid.setAttribute("aria-busy", "false");
    }
  }

  const delayedSearch = debounce(loadMovies, 400);
  searchInput.addEventListener("input", () => {
    requestId++;
    delayedSearch();
  });
  document.querySelector(".search-box").addEventListener("submit", event => {
    event.preventDefault();
    delayedSearch.cancel();
    loadMovies();
    document.querySelector("#movies").scrollIntoView({ behavior: "smooth" });
  });
  document.querySelectorAll('a[href="#trending"], [data-category]').forEach(link => {
    link.addEventListener("click", () => {
      delayedSearch.cancel();
      searchInput.value = "";
      if (window.location.hash === link.hash) loadMovies();
    });
  });
  window.addEventListener("hashchange", () => {
    if (!Object.hasOwn(headings, window.location.hash.slice(1))) return;
    delayedSearch.cancel();
    category = getCategory();
    searchInput.value = "";
    loadMovies();
  });

  document.addEventListener("click", async event => {
    const button = event.target.closest("[data-trailer-id], [data-more-info-id]");
    if (!button) return;
    const trailer = button.hasAttribute("data-trailer-id");
    const movieId = trailer ? button.dataset.trailerId : button.dataset.moreInfoId;
    if (!movieId) return;
    const modal = openMovieModal(trailer ? button.dataset.movieTitle : "Movie details");
    try {
      if (trailer) showTrailer(modal, await getMovieTrailer(movieId), button.dataset.movieTitle);
      else showMovieDetails(modal, await getMovieDetails(movieId));
    } catch (error) {
      showModalMessage(modal, error.message);
    }
  });
  await loadMovies();
}
