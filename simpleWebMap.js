
// Create a map object and set the view to a given center and zoom level
var map = L.map('map').setView([39.9,-97.75], 4);
// Define a color scale function using chroma.js
var colorScale = chroma.scale (['blue', 'red']).domain ([135000, 39501653]);

// Define the url of the geojson file hosted on github
var url = "https://raw.githubusercontent.com/gt4geo/somerepo/main/simplified.geojson";

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
	minZoom: 1
}).addTo(map);

// Get the slider input element by id
let sliderInput = document.getElementById("timeSlider");

// Fetch the geojson file using the fetch API once and store it in a variable
let geojsonData;
fetch(url)
    .then(function(response) {
        // Check if the response is ok
        if (response.ok) {
            // Parse the response as json
            return response.json();
			
        } else {
            // Throw an error if the response is not ok
            throw new Error("Could not fetch the geojson file");
        }
    })
    .then(function(data) {
        // Store the data in the variable
        geojsonData = data;
    })
    .catch(function(error) {
        // Log the error to the console
        console.error(error);
    });

// Create a variable to store the map layer
let mapLayer;

function drawMap(){
	let selectedYear = sliderInput.value;
	sliderInput.value = selectedYear
	var selectedYearText = "Y" + selectedYear.toString();
	console.log(selectedYear);
    // Define a function that uses the color scale function to get the color for each polygon
    function style(feature) {
        return {
			fillColor: colorScale (feature.properties[selectedYearText]),
			fillOpacity: 0.5,
			color: 'black',
			weight: 1
		  };
    }

    // Clear the previous map layer if it exists
    if (mapLayer) {
        mapLayer.clearLayers();
    }

    // Add a new map layer using the geojson data and the style function
    mapLayer = L.geoJSON(geojsonData, {
          onEachFeature: function(feature, layer) {
              // Bind a popup and a tooltip to each feature using template literals
              layer.bindPopup(`Year : ${selectedYearText.slice(1)} <br>
			  State : ${feature.properties["State"]} <br>
			  Population : ${feature.properties[selectedYearText]}`);
			  layer.bindTooltip (`${feature.properties["State"]} : <br> ${feature.properties[selectedYearText]}` , {permanent: true, direction: "center"});
          },
          style: style //Apply the style function to each feature
      }).addTo(map);

	// Create a new div element
	let mapTitle = document.getElementById("title-container");


	// Set the style attribute of the div element
	mapTitle.style = "display: block; margin: 0 auto; font-size: 3em; z-index: 9999";

	// Set the text content of the div element
	mapTitle.textContent = "Year" + selectedYear;

	}
// Set the slider value to 2020
sliderInput.value = 2020;
drawMap();

// Initialize the selectedYear variable with the current value of the slider input
let selectedYear = sliderInput.value;
sliderInput.addEventListener("change", drawMap);

// Get the button element by id
let playPauseButton = document.getElementById("playPauseButton");

// Initialize a timer variable
let timer = null;

// Define a function to toggle the button mode and update the selectedYear and the slider input
function togglePlayPause() {
  // If the button is on Play mode
  if (playPauseButton.textContent === "Play") {
    // Change the button text to Pause
    playPauseButton.textContent = "Pause";
    // Start a timer that increments the selectedYear by 1 every second
    timer = setInterval(function() {
      // If the selectedYear is less than 2022
      if (selectedYear < 2022) {
        // Increment the selectedYear by 1
        selectedYear = sliderInput.value;
		selectedYear++;
        // Update the slider input value with the selectedYear
        sliderInput.value = selectedYear;
		drawMap();
        // Log the selectedYear to the console
        console.log(selectedYear);
      } else {
        // Stop the timer
        clearInterval(timer);
      }
    }, 1000);
  } else {
    // If the button is on Pause mode
    // Change the button text to Play
    playPauseButton.textContent = "Play";
    // Stop the timer
    clearInterval(timer);
  }
}

// Add an onclick event listener to the button that calls the togglePlayPause function
playPauseButton.addEventListener("click", togglePlayPause);

// Add an onclick event listener to the button that calls the togglePlayPause function
playPauseButton.addEventListener("click", togglePlayPause);



