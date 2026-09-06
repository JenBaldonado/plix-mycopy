import {
  getPosterUrl,
  getReleaseYear,
  formatRating,
} from "../utils/formatter.js";
import { PLACEHOLDER_POSTER } from "../utils/constants.js";

export function openMovieModal(title = "Movie trailer") {
  document.querySelector(".movie-modal")?.close();
  const dialog = document.createElement("dialog");
  dialog.className = "movie-modal";
  dialog.setAttribute("aria-labelledby", "modal-title");
  dialog.innerHTML = `
    <div class="modal-heading">
    <h2 id="modal-title"></h2>
    <button class="modal-close" type="button" aria-label="Close dialog" autofocus>
     <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 7L17 17M17 7L7 17" />
      </svg>
    </button>
    </div>
    <div class="modal-body">
    <p class="status-message" role="status">Loading...</p>
    </div>`;
  dialog.querySelector("h2").textContent = title;
  dialog
    .querySelector(".modal-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  dialog.addEventListener(
    "close",
    () => {
      dialog.remove();
      if (!document.querySelector("dialog[open]"))
        document.body.classList.remove("modal-open");
    },
    { once: true },
  );
  document.body.append(dialog);
  document.body.classList.add("modal-open");
  dialog.showModal();
  return dialog;
}

export function showModalMessage(dialog, message) {
  if (!dialog.open) return;
  const paragraph = document.createElement("p");
  paragraph.className = "status-message";
  paragraph.setAttribute("role", "status");
  paragraph.textContent = message;
  dialog.querySelector(".modal-body").replaceChildren(paragraph);
}

export function showTrailer(dialog, key, title) {
  if (!dialog.open) return;
  if (!key || !/^[a-zA-Z0-9_-]+$/.test(key)) {
    showModalMessage(dialog, "No trailer is available for this movie yet.");
    return;
  }
  const frame = document.createElement("iframe");
  frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(key)}?autoplay=1`;
  frame.title = `${title} trailer`;
  frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  frame.allowFullscreen = true;
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  const link = document.createElement("a");
  link.className = "external-trailer";
  link.href = `https://www.youtube.com/watch?v=${encodeURIComponent(key)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Watch on YouTube";
  dialog.querySelector(".modal-body").replaceChildren(frame, link);
}

export function showMovieDetails(dialog, movie) {
  if (!dialog.open) return;
  dialog.querySelector("h2").textContent = movie.title;
  const details = document.createElement("div");
  details.className = "movie-details";
  details.innerHTML =
    '<img alt="" width="500" height="750"><div><p class="metadata"></p><p class="genres"></p><p class="detail-overview"></p></div>';
  const image = details.querySelector("img");
  image.src = getPosterUrl(movie.poster_path);
  image.addEventListener(
    "error",
    () => {
      image.src = PLACEHOLDER_POSTER;
    },
    { once: true },
  );
  details.querySelector(".metadata").textContent = [
    getReleaseYear(movie.release_date),
    `\u2605 ${formatRating(movie.vote_average)}`,
    movie.runtime ? `${movie.runtime} min` : null,
  ]
    .filter(Boolean)
    .join(" ? ");
  details.querySelector(".genres").textContent = (movie.genres || [])
    .map((genre) => genre.name)
    .join(" / ");
  details.querySelector(".detail-overview").textContent =
    movie.overview || "No description is currently available.";
  dialog.querySelector(".modal-body").replaceChildren(details);
}
