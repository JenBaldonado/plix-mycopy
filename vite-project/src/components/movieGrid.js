import { createMovieCard } from "./movieCard.js";

export function renderMovieGrid(container, movies) {
  container.replaceChildren();

  if (!movies.length) {
    container.innerHTML = `
      <p class="status-message">No movies found.</p>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  movies.forEach(movie => {
    fragment.append(createMovieCard(movie));
  });

  container.append(fragment);
}