let locations;
const loader = document.querySelector(".loader-hidden");
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFtemVoLWFtYXlyZWgiLCJhIjoiY2xqd2o3aW5tMDJ2dzNkbndnNmhsMnFjNiJ9.wYU83Zm70gWZZfx8Ev5PzQ";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [35.908, 31.956004],
  zoom: 13,
});
map.addControl(new mapboxgl.NavigationControl());
var searchInput = document.getElementById("search-input");
var searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", function () {
  loader.classList.remove("loader-hidden");
  loader.classList.add("loader");
  var city = searchInput.value;
  if (city.length == 0 || city.trim.length == 0) {
    loader.classList.remove("loader");
    loader.classList.add("loader-hidden");
    alert("Please enter a city before searching");
    return;
  }
  async function getData() {
    try {
      let config = {
        headers: {
          "X-Api-Key": "mHpXTvuLXj1W0J6xrCt4/w==UHsqNrpi45ikGzTJ",
        },
      };
      if (city.length == 0) {
        loader.classList.remove("loader");
        loader.classList.add("loader-hidden");
        return;
      }
      let response = await fetch(
        `https://api.api-ninjas.com/v1/city?name=${city}`,
        config
      );
      locations = await response.json();

      if (locations === undefined || locations.length == 0) {
        alert("Please enter a valid city");
        return;
      }
      console.log(locations);
      let x = locations[0].latitude;
      let y = locations[0].longitude;

      map.setCenter([y, x]);
      map.setZoom(11);
      console.log(x);
      console.log(y);
    } catch (error) {
      console.log(error);
    }
  }
  getData();
  setTimeout(function () {
    loader.classList.remove("loader");
    loader.classList.add("loader-hidden");
  }, 2000);
});
