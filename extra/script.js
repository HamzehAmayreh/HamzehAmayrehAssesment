let locations;
import { offices } from "./cities.js";
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers

  // Convert latitude and longitude from degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;
  return distance;
}

// Function to convert degrees to radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

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
  if (city.length == 0) {
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
      let longitudeP = locations[0].longitude;
      let latitudeP = locations[0].latitude;

      let shortestDistance = {
        distance: Number.MAX_VALUE,
        city: "",
        latitude: 0,
        longitude: 0,
      };

      for (let i = 0; i < offices.length; i++) {
        let calculatedDistance = calculateDistance(
          latitudeP,
          longitudeP,
          offices[i].latitude,
          offices[i].longitude
        );
        if (calculatedDistance < shortestDistance.distance) {
          shortestDistance.city = offices[i].city;
          shortestDistance.latitude = offices[i].latitude;
          shortestDistance.longitude = offices[i].longitude;
          shortestDistance.distance = calculatedDistance;
        }
      }

      map.setCenter([shortestDistance.longitude, shortestDistance.latitude]);
      map.setZoom(11);
      console.log(shortestDistance.city);
      console.log(shortestDistance.longitude);
      console.log(shortestDistance.latitude);
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
