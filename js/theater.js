
const THEATER_URL =
"https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2022-10-01&primary_release_date.lte=2022-12-31&api_key=229d819906342a6a79fb1641a3951859&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";


const mainTheater = document.getElementById("mainTheater");
const form = document.getElementById("form");
const search = document.getElementById("search");


getTheater(THEATER_URL);

async function getTheater(url) {
  const res = await fetch(url);
  const data = await res.json();

  displayTheater(data.results);
}

function displayTheater(theaters) {
  mainTheater.innerHTML = "";

  theaters.forEach((theater) => {
    const { title, poster_path, vote_average, overview, release_date } =
      theater;

    const theaterEl = document.createElement("div");
    theaterEl.classList.add("movie");
    theaterEl.innerHTML = `
      <img src="${IMG_PATH + poster_path}" alt="${title}">
      <div class="release">Release date: ${release_date}</div>
      <div class="movie-info">
           <h3>${title}</h3>
           <div class= "rating-container">
            <span class="${getClassByRate(vote_average)}">${Math.round(vote_average * 100)/100}<span>
           </div>
       </div>
       <div class="overview">
         <h3>Overview</h3>
         ${overview}
       </div>
      `;

    mainTheater.appendChild(theaterEl);
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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;
 
  sessionStorage.setItem('search-item', searchTerm);

  window.location.href='result.html'
    
});