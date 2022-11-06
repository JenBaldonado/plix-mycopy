const TRENDING_URL =
  "https://api.themoviedb.org/3/trending/movie/week?api_key=229d819906342a6a79fb1641a3951859&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";

/*--------------------------------------------------------------HOME----------------------------------------------*/

const mainTrending = document.getElementById("trends");
const form = document.getElementById("form");
const search = document.getElementById("search");

getMovie(TRENDING_URL);

async function getMovie(url) {
  const res = await fetch(url);
  const data = await res.json();

  showMovie(data.results);
}

function showMovie(trends) {
  mainTrending.innerHTML = "";

  trends.forEach((trend) => {
    const { title, poster_path, vote_average, overview } = trend;

    const trendEl = document.createElement("div");
    trendEl.classList.add("movie");
    trendEl.innerHTML = `
      <img src="${IMG_PATH + poster_path}" alt="${title}">
      <div class="movie-info">
           <h3>${title}</h3>
           <div class= "rating-container">
            <span class="${getClassByRate(vote_average)}">${Math.round(vote_average * 100) / 100
      }<span>
           </div>
       </div>
       <div class="overview">
         <h3>Overview</h3>
         ${overview}
       </div>
      `;

    mainTrending.appendChild(trendEl);
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

  sessionStorage.setItem("search-item", searchTerm);

  window.location.href = "result.html";
});


/*---------horizontal Swiping-----------*/

var swiper = new Swiper(".slide-content", {
  slidesPerView: 3,
  spaceBetween: 25,
  loop: true,
  centerSlide: 'true',
  fade: 'true',
  grabCursor: 'true',
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    520: {
      slidesPerView: 2,
    },
    950: {
      slidesPerView: 3,
    },
  },
});

/* -------------------JQUERY-------------------------- */

/*The video stops at closing*/
$("#trailerOne").on("hidden.bs.modal", function (e) {
  $("#trailerOne iframe").attr("src", $("#trailerOne iframe").attr("src"));
});

$("#trailerTwo").on("hidden.bs.modal", function (e) {
  $("#trailerTwo iframe").attr("src", $("#trailerTwo iframe").attr("src"));
});
$("#trailerThree").on("hidden.bs.modal", function (e) {
  $("#trailerThree iframe").attr("src", $("#trailerThree iframe").attr("src"));
});
$("#trailerFour").on("hidden.bs.modal", function (e) {
  $("#trailerFour iframe").attr("src", $("#trailerFour iframe").attr("src"));
});
$("#trailerFive").on("hidden.bs.modal", function (e) {
  $("#trailerFive iframe").attr("src", $("#trailerFive iframe").attr("src"));
});
$("#trailerSix").on("hidden.bs.modal", function (e) {
  $("#trailerSix iframe").attr("src", $("#trailerSix iframe").attr("src"));
});
$("#trailerSeven").on("hidden.bs.modal", function (e) {
  $("#trailerSeven iframe").attr("src", $("#trailerSeven iframe").attr("src"));
});
$("#trailerEight").on("hidden.bs.modal", function (e) {
  $("#trailerEight iframe").attr("src", $("#trailerEight iframe").attr("src"));
});
