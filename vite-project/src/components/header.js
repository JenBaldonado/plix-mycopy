export function renderHeader() {
  document.querySelector(".site-header").innerHTML = `
    <a class="logo" href="#trending" aria-label="Plix home">PLIX<span>.</span></a>
    <nav class="main-nav" id="main-nav" aria-label="Main navigation">
      <a href="#trending" data-category="trending">Trending</a>
      <a href="#popular" data-category="popular">Popular</a>
      <a href="#drama" data-category="drama">Drama</a>
      <a href="#theaters" data-category="theaters">In Theaters</a>
    </nav>
    <div class="header-actions">
      <form class="search-box" role="search">
        <label class="sr-only" for="movie-search">Search movies</label>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg>
        <input id="movie-search" type="search" placeholder="Search movies..." autocomplete="off" />
      </form>
      <button class="menu-button" type="button" aria-label="Toggle navigation" aria-controls="main-nav" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>`;

  const toggle = document.querySelector(".menu-button");
  const nav = document.querySelector(".main-nav");
  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  nav.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      toggle.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      toggle.focus();
    }
  });
}
