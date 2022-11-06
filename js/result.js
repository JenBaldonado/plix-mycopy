const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API =
  'https://api.themoviedb.org/3/search/movie?&api_key=229d819906342a6a79fb1641a3951859&query="';

const form = document.getElementById("form");
const search = document.getElementById("searchResult");
const mainresult = document.getElementById("results");

async function getResults(url) {
  const res = await fetch(url);
  const data = await res.json();

  showResult(data.results);
}

function showResult(results) {
  mainresult.innerHTML = "";

  results.forEach((result) => {
    const { title, poster_path, vote_average, overview } = result;

    const resultEl = document.createElement("div");
    resultEl.classList.add("movie");
    resultEl.innerHTML = `
      <img src="${IMG_PATH + poster_path}" alt="${title}">
      <div class="movie-info">
           <h3>${title}</h3>
           <div class= "rating-container">
            <span class="${getClassByRate(vote_average)}">${
      Math.round(vote_average * 100) / 100
    }<span>
           </div>
       </div>
       <div class="overview">
         <h3>Overview</h3>
         ${overview}
       </div>
      `;

    mainresult.appendChild(resultEl);
  });
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

function searchResult() {
  const searchInput = sessionStorage.getItem("search-item");

  getResults(SEARCH_API + searchInput);
}

searchResult();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;

  if (searchTerm && searchTerm !== "") {
    getResults(SEARCH_API + searchTerm);

    search.value = "";
  } else {
    window.location.reload();
  }
});
