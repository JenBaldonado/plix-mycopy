import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { build } from "vite";
import { JSDOM } from "jsdom";

test("movie app integration", async t => {
  process.env.VITE_API_KEY = "test-key";
  const bundle = await build({ logLevel: "silent", build: { ssr: "src/app.js", write: false, minify: false } });
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const dom = new JSDOM(html, { url: "http://localhost/" });
  const { window } = dom;
  const originalFetch = globalThis.fetch;
  globalThis.window = window;
  globalThis.document = window.document;
  // jsdom does not implement native dialog/top-layer behavior or scrolling.
  window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  window.HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new window.Event("close"));
  };
  window.HTMLElement.prototype.scrollIntoView = function () {};
  const movie = {
    id: 42, title: 'A "quoted" <movie>', overview: "A movie overview.",
    release_date: "2026-09-01", vote_average: 8.2, poster_path: null, backdrop_path: null,
  };
  let handler = () => ({ results: [movie] });
  const requests = [];
  globalThis.fetch = async url => {
    const parsed = new URL(url);
    requests.push(parsed);
    const data = await handler(parsed);
    return data instanceof Response ? data : new Response(JSON.stringify(data), { status: 200 });
  };
  const waitFor = async predicate => {
    for (let index = 0; index < 100; index++) {
      if (predicate()) return;
      await delay(10);
    }
    assert.fail("Timed out waiting for app state");
  };
  const $ = selector => document.querySelector(selector);
  const input = value => {
    $("#movie-search").value = value;
    $("#movie-search").dispatchEvent(new window.Event("input", { bubbles: true }));
  };
  const submit = () => $(".search-box").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  try {
    const { initializeApp } = await import("data:text/javascript;base64," + Buffer.from(bundle.output.find(file => file.type === "chunk" && file.isEntry).code).toString("base64"));
    await initializeApp();

    await t.test("initial load uses trending endpoint and renders safe titles and fallback imagery", () => {
      assert.equal(requests[0].pathname, "/3/trending/movie/week");
      assert.equal(requests[0].searchParams.get("api_key"), "test-key");
      assert.equal($(".movie-title").textContent, movie.title);
      assert.equal($(".card-play").dataset.movieTitle, movie.title);
      assert.equal(document.querySelectorAll("movie").length, 0);
      assert.match($(".poster img").src, /placeholder-poster.svg$/);
      assert.equal($("[data-more-info-id]").dataset.moreInfoId, "42");
      assert.equal($("#trending-grid").getAttribute("aria-busy"), "false");
    });

    await t.test("search encodes special characters and clearing restores category", async () => {
      input('A & B "movie"');
      submit();
      await waitFor(() => $("#trending-grid").getAttribute("aria-busy") === "false");
      assert.equal(requests.at(-1).pathname, "/3/search/movie");
      assert.equal(requests.at(-1).searchParams.get("query"), 'A & B "movie"');
      assert.equal(requests.at(-1).searchParams.get("include_adult"), "false");
      input("");
      submit();
      await waitFor(() => $("#trending-grid").getAttribute("aria-busy") === "false");
      assert.equal(requests.at(-1).pathname, "/3/trending/movie/week");
    });

    await t.test("category navigation loads current theater endpoint and mobile menu toggles", async () => {
      $(".menu-button").click();
      assert.equal($(".menu-button").getAttribute("aria-expanded"), "true");
      $('[data-category="theaters"]').click();
      await waitFor(() => $("#movies-heading").textContent === "Now In Theaters" && $("#trending-grid").getAttribute("aria-busy") === "false");
      assert.equal(requests.at(-1).pathname, "/3/movie/now_playing");
      assert.equal($(".menu-button").getAttribute("aria-expanded"), "false");
      assert.equal($('[data-category="theaters"]').getAttribute("aria-current"), "page");
    });

    await t.test("trailer opens, selects official YouTube video, and removes iframe on close", async () => {
      handler = () => ({ results: [{ site: "YouTube", type: "Trailer", official: true, key: "test_video" }] });
      $(".card-play").click();
      await waitFor(() => $(".movie-modal iframe"));
      assert.equal(requests.at(-1).pathname, "/3/movie/42/videos");
      assert.equal($(".movie-modal iframe").title, movie.title + " trailer");
      $(".modal-close").click();
      assert.equal($(".movie-modal"), null);
      assert.equal(document.body.classList.contains("modal-open"), false);
    });

    await t.test("missing trailers show an empty state", async () => {
      handler = () => ({ results: [] });
      $(".card-play").click();
      await waitFor(() => $(".modal-body").textContent.includes("No trailer"));
      $(".modal-close").click();
    });

    await t.test("movie details open with runtime, genres, and escaped text", async () => {
      handler = () => ({ ...movie, runtime: 120, genres: [{ name: "Drama" }] });
      $(".movie-title").click();
      await waitFor(() => $(".movie-details"));
      assert.equal(requests.at(-1).pathname, "/3/movie/42");
      assert.equal($("#modal-title").textContent, movie.title);
      assert.match($(".movie-details .metadata").textContent, /120 min/);
      assert.equal($(".genres").textContent, "Drama");
      $(".modal-close").click();
    });

    await t.test("failed requests show a retry button and recover", async () => {
      handler = () => new Response("{}", { status: 401 });
      input("failure");
      submit();
      await waitFor(() => $("#trending-grid [role=alert]"));
      assert.match($("#trending-grid").textContent, /rejected the API key/);
      handler = () => ({ results: [movie] });
      $("#trending-grid button").click();
      await waitFor(() => $(".movie-card"));
    });

    await t.test("older search responses cannot overwrite newer results", async () => {
      let resolveOld;
      handler = url => url.searchParams.get("query") === "old"
        ? new Promise(resolve => { resolveOld = resolve; })
        : { results: [{ ...movie, title: "New result" }] };
      input("old");
      submit();
      await waitFor(() => resolveOld);
      input("new");
      submit();
      await waitFor(() => $(".movie-title")?.textContent === "New result");
      resolveOld({ results: [{ ...movie, title: "Old result" }] });
      await delay(30);
      assert.equal($(".movie-title").textContent, "New result");
    });

    await t.test("empty home responses clear hero actions without crashing", async () => {
      handler = () => ({ results: [] });
      input("");
      submit();
      await waitFor(() => $("#trending-grid").getAttribute("aria-busy") === "false");
      assert.match($("#trending-grid").textContent, /No movies found/);
      assert.equal($(".hero-actions").hidden, true);
      assert.equal($("[data-hero-title]").textContent, "Discover something great.");
    });
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.window;
    delete globalThis.document;
    delete process.env.VITE_API_KEY;
    dom.window.close();
  }
});
