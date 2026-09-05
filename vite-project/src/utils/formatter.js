import {
  IMAGE_BASE_URL,
  POSTER_SIZE,
  BACKDROP_SIZE,
  PLACEHOLDER_POSTER,
} from "./constants.js";

export function getPosterUrl(path) {
  return path
    ? `${IMAGE_BASE_URL}/${POSTER_SIZE}${path}`
    : PLACEHOLDER_POSTER;
}

export function getBackdropUrl(path) {
  return path
    ? `${IMAGE_BASE_URL}/${BACKDROP_SIZE}${path}`
    : PLACEHOLDER_POSTER;
}

export function getReleaseYear(date) {
  return date ? new Date(date).getFullYear() : "TBA";
}

export function formatRating(rating) {
  return Number(rating || 0).toFixed(1);
}