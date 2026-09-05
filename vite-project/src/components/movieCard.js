import { getPosterUrl, getReleaseYear, formatRating } from "../utils/formatter.js";
import { PLACEHOLDER_POSTER } from "../utils/constants.js";

export function createMovieCard(movie) {
  const article = document.createElement("article");
  article.className = "movie-card";
  // Only static markup is interpolated; API text is assigned through DOM properties.
  article.innerHTML = `
    <div class="poster">
      <img alt="" loading="lazy" width="500" height="750">
      <button class="card-play" type="button"><span aria-hidden="true">&#9654;</span></button>
    </div>
    <div class="card-details">
      <h3><button class="movie-title" type="button"></button></h3>
      <div class="movie-metadata"><span class="release-year"></span><span class="rating"></span></div>
    </div>`;
  const image = article.querySelector("img");
  image.src = getPosterUrl(movie.poster_path);
  image.addEventListener("error", () => { image.src = PLACEHOLDER_POSTER; }, { once: true });
  const play = article.querySelector(".card-play");
  play.dataset.trailerId = movie.id;
  play.dataset.movieTitle = movie.title;
  play.setAttribute("aria-label", `Watch ${movie.title} trailer`);
  const title = article.querySelector(".movie-title");
  title.textContent = movie.title;
  title.title = movie.title;
  title.dataset.moreInfoId = movie.id;
  article.querySelector(".release-year").textContent = getReleaseYear(movie.release_date);
  article.querySelector(".rating").textContent = `\u2605 ${formatRating(movie.vote_average)}`;
  return article;
}
