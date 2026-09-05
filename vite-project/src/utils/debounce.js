export function debounce(callback, delay = 400) {
  let timeoutId;
  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
}
