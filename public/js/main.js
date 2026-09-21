const getLocation = () => {
    // Check if geolocation is supported
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        $("#locationButton").text("Geolocation is not supported by this browser.");
    }
}

// Function to handle the position data(this gets called when the user allows location access and it returns only the latitude and longitude)
const showPosition = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(`Latitude: ${lat}`);
    console.log(`Longitude: ${lon}`);

// Use the coordinates to get the address using Geoapify API(geo reverse geocoding). API key is required to access the Geoapify API. You can sign up for a free account on the Geoapify website to obtain an API key. Once you have the API key, you can replace 'YOUR_API_KEY' in the code with your actual API key. This will allow you to make requests to the Geoapify API and retrieve address infor
// ation based on the latitude and longitude coordinates.)
//And this converts our latitude and longitude
// into a human-readable address. The Geoapify API takes the latitude and longitude as input 
// nd returns the corresponding address information in JSON format. We can then extract the formatted address from the response and display it on the webpage.
const apiKey = '565bf440c9ce4b2894506acc16ec862a';
const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data.features && data.features.length > 0) {
      const address = data.features[0].properties.formatted;
      console.log("Address:", address);
       $("#locationButton").text(address);
    } else {
      console.log("No address found");
    }
  })
  .catch(error => console.error('Error:', error));

  // fetch for UV details from the backend server. The backend server will then make a request to the OpenUV API to get the UV details based on the latitude and longitude coordinates. The response from the OpenUV API will be sent back to the frontend, where we can log it to the console or update the UI with the UV details.
  fetch(`/uv-details?lat=${lat}&lng=${lon}`)
    .then(response => response.json())
    .then(data => {
      console.log("UV Details:", data);
      // You can update the UI with the UV details here
      updateUVDisplay(data.result);
    })
    .catch(error => console.error('Error:', error));

   
}

const updateUVDisplay = (result) => {
  const uv = result.uv;
  const burnMinutes = result.safe_exposure_time.st3;

  $("#uvIndex").text(uv);
  $("#burnTime").text(`${burnMinutes} min`);
  $("#spfRec").text(getSpfRecommendation(uv));
  $("#welcomeMessage").text(getSunscreenAdvice(uv));
};

const getSpfRecommendation = (uv) => {
  if (uv < 3) return "SPF 15+";
  if (uv < 6) return "SPF 30+";
  if (uv < 8) return "SPF 30–50+";
  return "SPF 50+";
};

const getSunscreenAdvice = (uv) => {
  if (uv < 3) return "UV is low right now, so you don't need sunscreen unless you'll be outside for a long time.";
  if (uv < 8) return "Yes, apply sunscreen before you head out!";
  return "Yes, apply sunscreen, and also seek shade and wear a hat. UV is very high.";
};


// Function to handle errors
const showError = (error) => {
    console.log(error);
    switch(error.code) {
        case error.PERMISSION_DENIED:
            $("#locationButton").text("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            $("#locationButton").text("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            $("#locationButton").text("The request to get user location timed out.");
            break;

            case error.UnknownError:
            $("#locationButton").text("An unknown error occurred.");
            break;
            default:
            $("#locationButton").text("An unknown error occurred.");
            break;
    }
}