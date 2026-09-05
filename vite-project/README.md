# Plix

A Vite movie discovery app with trending, popular, drama, and now-playing movies, search, trailers, and movie details.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `VITE_API_KEY` to your TMDB **v3 API key**.
3. Start with `npm run dev` and open the URL Vite prints.
4. Restart Vite whenever you edit `.env`.

On Windows PowerShell, use `npm.cmd` if execution policy prevents `npm` from running.

Vite exposes `VITE_*` values in the browser bundle. The ignored `.env` file avoids committing the key; keeping a credential private requires a backend.

## Checks

- `npm test` runs integration tests with simulated API responses.
- `npm run build` creates the production app in `dist`.
- `npm run preview` serves the production build locally.

The DOM tests cover API routing, search, navigation, dialogs, empty results, retries, title escaping, and request ordering. Native dialog focus behavior and visual layout still need a real browser check.

## Project structure

- `index.html`: loads the single stylesheet directly, independently of JavaScript.
- `src/main.js`: application entry point.
- `src/styles/style.css`: shared styles, responsive layouts, and dialogs.
- `src/app.js`: loading, search, navigation, and movie interactions.
- `src/api/tmdb.js`: authentication, URL parameters, timeout, and HTTP errors.
- `src/services/movieService.js`: movie categories, search, details, and trailers.
- `src/components`: UI rendering.
