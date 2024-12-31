/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 * 
 */


/**
 * Modified version of the Google Documentation code for the maps API.
 */

let guess;


// Initialize the main function
function initialize() {
  // Generate random position
  let randPos = getLoc();
  const genLoc = {lat: 32.61618222051007, lng: 18.05842082884213 };
  // Create the map and set the location to constant start coordinates
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: genLoc,
      zoom: 1.25,
      streetViewControl: false,
      clickableIcons: false
      
    }
  );

  // Create markers for users to make their guess (expected vs actual)
  let markerGuess = new google.maps.Marker({});
  let markerActual = new google.maps.Marker({});

  // Set the randomly generated location marker to it's proper position
  // Make the marker initially invisible.
  markerActual.setPosition(randPos);
  markerActual.setMap(map);
  markerActual.setIcon("pin-48.svg")
  markerActual.setVisible(false);



  // Add an event listener to the map to capture 
  // each location guess and set the guess global
  map.addListener("click", (mapsMouseEvent) => {
    markerGuess.setPosition(mapsMouseEvent.latLng);
    markerGuess.setMap(map);
    guess = mapsMouseEvent.latLng;
    console.log(mapsMouseEvent.latLng);
    
  })

  // Create the streetview
  let panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano") as HTMLElement,
    {
      position: randPos,
      pov: {
        heading: 34,
        pitch: 10,
      },
      addressControl: false,
    }
  );

  // Initialize some html elements for gameplay functionality
  const guessed = document.getElementById("guessBtn") as HTMLButtonElement;
  const popup = document.getElementById("guessPopup") as HTMLElement;
  const popupBtn = document.getElementById("popupButton") as HTMLButtonElement;
  const distanceElement = document.getElementById("distance") as HTMLParagraphElement;
  popup.hidden = true;

  // Add an event listenter to the guess button to 
  // capture final user guess
  guessed?.addEventListener("click", () => {
    // Calculate the distance of the user's guess against the actual location
    const distanceCalculated = calcDistance(randPos, guess);
    popup.hidden = false;
    distanceElement.textContent = "Your guess was " + distanceCalculated + " Miles away";
    markerActual.setVisible(true);
  });

  // Generate a new location for the next round and
  // reset variables
  popupBtn.addEventListener("click", async () => {
    randPos = getLoc();
    markerActual.setVisible(false);
    popup.hidden = true;
    markerGuess.setPosition(null);
    await updateLoc(panorama, randPos).then((updated) => {panorama = updated});
    markerActual.setPosition(randPos);
  });

  

}

// Asynchronous function that calls the panorama api
// and gets a new location 
async function updateLoc(panorama , randPos) {
  panorama.setPosition(randPos);
  return panorama;
}

// Simple function that calculates the spherical distance between two lat,lon points
// and converts them to imperial units.
function calcDistance(expected, actual) {
  const generatedLocation = new google.maps.LatLng(expected);
  const guessedLocation = new google.maps.LatLng(actual);  
  const convert = (google.maps.geometry.spherical.computeDistanceBetween(generatedLocation, guessedLocation) / 1000.0) * 0.6214;
  return convert.toFixed(2);

}

// Very messy (but verified) set of locations to choose from for the random
// location generation. In the future, i'd like to make this cleaner by having a csv
// file with locations that are verified to be valid with StreetView.
function getLoc() {
  const dict = [
    { lat: 40.748817, lng: -73.985428 },   // New York, USA (Empire State Building)
    { lat: 48.858844, lng: 2.294351 },     // Paris, France (Eiffel Tower)
    { lat: -22.951916, lng: -43.210487 },  // Rio de Janeiro, Brazil (Christ the Redeemer)
    { lat: 35.658581, lng: 139.745438 },   // Tokyo, Japan (Tokyo Tower)
    { lat: -13.163141, lng: -72.544963 },  // Machu Picchu, Peru
    { lat: 51.500729, lng: -0.124625 },    // London, UK (Big Ben)
    { lat: 37.819929, lng: -122.478255 },  // San Francisco, USA (Golden Gate Bridge)
    { lat: -33.856159, lng: 151.215256 },  // Sydney, Australia (Sydney Opera House)
    { lat: 27.175015, lng: 78.042155 },    // Agra, India (Taj Mahal)
    { lat: 55.755826, lng: 37.617300 },    // Moscow, Russia (Red Square)
    { lat: 25.197197, lng: 55.274376 },    // Dubai, UAE (Burj Khalifa)
    { lat: -34.603722, lng: -58.381592 },  // Buenos Aires, Argentina (Obelisco de Buenos Aires)
    { lat: 60.169856, lng: 24.938379 },    // Helsinki, Finland (Senate Square)
    { lat: 64.135338, lng: -21.895210 },   // Reykjavik, Iceland (Hallgrimskirkja)
    { lat: 43.769562, lng: 11.255814 },    // Florence, Italy (Piazza della Signoria)
    { lat: 35.689487, lng: 139.691706 },   // Tokyo, Japan (Shibuya Crossing)
    { lat: -25.344490, lng: 131.036995 },  // Uluru, Australia
    { lat: 41.902783, lng: 12.496366 },    // Rome, Italy (Colosseum)
    { lat: 34.052235, lng: -118.243683 },  // Los Angeles, USA (Hollywood Sign)
    { lat: 40.689247, lng: -74.044502 },   // New York, USA (Statue of Liberty)
    { lat: 48.856613, lng: 2.352222 },     // Paris, France (Louvre Museum)
    { lat: -33.924870, lng: 18.424055 },   // Cape Town, South Africa (Table Mountain)
    { lat: 35.360638, lng: 138.727364 },   // Mount Fuji, Japan
    { lat: 52.520007, lng: 13.404954 },    // Berlin, Germany (Brandenburg Gate)
    { lat: 41.890251, lng: 12.492373 },    // Rome, Italy (Trevi Fountain)
    { lat: 51.178882, lng: -1.826215 },    // Stonehenge, UK
    { lat: 30.044420, lng: 31.235712 },    // Cairo, Egypt (Great Pyramid of Giza)
    { lat: 43.723019, lng: 10.396633 },    // Pisa, Italy (Leaning Tower of Pisa)
    { lat: 40.431908, lng: 116.570374 },   // Beijing, China (Great Wall)
    { lat: 1.352083, lng: 103.819839 },    // Singapore (Marina Bay Sands)
    { lat: 34.693737, lng: 135.502167 },   // Osaka, Japan (Osaka Castle)
    { lat: 41.008240, lng: 28.978359 },    // Istanbul, Turkey (Hagia Sophia)
    { lat: -1.292066, lng: 36.821946 },    // Nairobi, Kenya (Nairobi National Park)
    { lat: 25.033964, lng: 121.564468 },   // Taipei, Taiwan (Taipei 101)
    { lat: 33.748997, lng: -84.387985 },   // Atlanta, USA (Centennial Olympic Park)
    { lat: 43.651070, lng: -79.347015 },   // Toronto, Canada (CN Tower)
    { lat: -23.550520, lng: -46.633308 },  // São Paulo, Brazil (Avenida Paulista)
    { lat: 21.028511, lng: 105.804817 },   // Hanoi, Vietnam (Hoan Kiem Lake)
    { lat: -35.280937, lng: 149.130009 },  // Canberra, Australia (Parliament House)
    { lat: 33.511761, lng: 36.306446 },    // Damascus, Syria (Umayyad Mosque)
    { lat: -15.793889, lng: -47.882778 },  // Brasília, Brazil (National Congress)
    { lat: 19.432608, lng: -99.133209 },   // Mexico City, Mexico (Zócalo)
    { lat: 59.329323, lng: 18.068581 },    // Stockholm, Sweden (Gamla Stan)
    { lat: 13.412469, lng: 103.866986 },   // Angkor Wat, Cambodia
    { lat: 31.224361, lng: 121.469170 },   // Shanghai, China (The Bund)
    { lat: 28.613939, lng: 77.209021 },    // New Delhi, India (India Gate)
    { lat: 19.076090, lng: 72.877426 },    // Mumbai, India (Gateway of India)
    { lat: -4.441931, lng: 15.266293 },    // Kinshasa, DRC (Palais de la Nation)
    { lat: 37.566536, lng: 126.977966 },   // Seoul, South Korea (Gyeongbokgung Palace)
    { lat: -8.340539, lng: 115.092111 },   // Bali, Indonesia (Uluwatu Temple)
    { lat: 45.440847, lng: 12.315515 },    // Venice, Italy (St. Mark's Square)
    { lat: -7.946527, lng: 112.614570 },   // Malang, Indonesia (Mount Bromo)
    { lat: 35.011636, lng: 135.768029 },   // Kyoto, Japan (Kinkaku-ji)
    { lat: 40.712776, lng: -74.005974 },   // New York, USA (Times Square)
    { lat: 25.761681, lng: -80.191788 },   // Miami, USA (South Beach)
    { lat: -8.409518, lng: 115.188919 },   // Ubud, Indonesia (Sacred Monkey Forest)
    { lat: 41.902782, lng: 12.496365 },    // Vatican City (St. Peter's Basilica)
    { lat: 34.693738, lng: 135.502167 },   // Osaka, Japan (Dotonbori)
    { lat: -1.940278, lng: 29.873888 },    // Kigali, Rwanda (Mount Kigali)
    { lat: 53.349805, lng: -6.260310 },    // Dublin, Ireland (Trinity College)
    { lat: 36.169941, lng: -115.139830 },  // Las Vegas, USA (Las Vegas Strip)
    { lat: 41.385064, lng: 2.173404 },     // Barcelona, Spain (Sagrada Familia)
    { lat: 37.774929, lng: -122.419418 },  // San Francisco, USA (Alcatraz Island)
    { lat: -3.373056, lng: 29.918888 },    // Bujumbura, Burundi (Rusizi National Park)
    { lat: 50.075539, lng: 14.437800 },    // Prague, Czech Republic (Charles Bridge)
    { lat: 52.367984, lng: 4.903561 },     // Amsterdam, Netherlands (Dam Square)
    { lat: 47.497913, lng: 19.040236 },    // Budapest, Hungary (Buda Castle)
    { lat: -1.286389, lng: 36.817223 },    // Nairobi, Kenya (Kenyatta International Conference Center)
    { lat: 55.953252, lng: -3.188267 },    // Edinburgh, UK (Edinburgh Castle)
    { lat: 6.524379, lng: 3.379206 },      // Lagos, Nigeria (Freedom Park)
    { lat: 33.886917, lng: 9.537499 },     // Tunis, Tunisia (Carthage)
    { lat: 36.204823, lng: 138.252930 },   // Japan (Matsumoto Castle)
    { lat: 37.983810, lng: 23.727539 },    // Athens, Greece (Acropolis)
    { lat: 50.110922, lng: 8.682127 },     // Frankfurt, Germany (Römer)
    { lat: 41.377491, lng: 2.158990 },     // Barcelona, Spain (Park Güell)
    { lat: 59.913868, lng: 10.752245 },    // Oslo, Norway (Oslo Opera House)
    { lat: -12.046374, lng: -77.042793 },  // Lima, Peru (Plaza Mayor)
    { lat: 40.416775, lng: -3.703790 },    // Madrid, Spain (Puerta del Sol)
    { lat: 18.109581, lng: -77.297508 },   // Jamaica (Dunn's River Falls)
    { lat: 14.599512, lng: 120.984222 },   // Manila, Philippines (Intramuros)
    { lat: -31.950527, lng: 115.860457 },  // Perth, Australia (Kings Park)
    { lat: 28.704060, lng: 77.102493 },    // New Delhi, India (Qutub Minar)
    { lat: 39.904202, lng: 116.407394 },   // Beijing, China (Forbidden City)
    { lat: 13.756331, lng: 100.501762 },   // Bangkok, Thailand (Grand Palace)
    { lat: -8.119554, lng: -79.029153 },   // Trujillo, Peru (Chan Chan)
    { lat: 44.426767, lng: 26.102538 },    // Bucharest, Romania (Palace of the Parliament)
    { lat: -26.204103, lng: 28.047305 },   // Johannesburg, South Africa (Constitution Hill)
    { lat: 38.722252, lng: -9.139337 },    // Lisbon, Portugal (Belém Tower)
    { lat: 37.983810, lng: 23.727539 },    // Athens, Greece (Parthenon)
    { lat: 48.208176, lng: 16.373819 },    // Vienna, Austria (St. Stephen's Cathedral)
    { lat: 54.687157, lng: 25.279652 },    // Vilnius, Lithuania (Gediminas' Tower)
    { lat: 12.971599, lng: 77.594566 },    // Bangalore, India (Lalbagh Botanical Garden)
    { lat: 18.520430, lng: 73.856744 },    // Pune, India (Shaniwar Wada)
    { lat: 29.979234, lng: 31.134202 },    // Giza, Egypt (Sphinx)
    { lat: 21.161907, lng: -86.851524 },   // Cancun, Mexico (Hotel Zone)
    { lat: 51.044733, lng: -114.071883 },  // Calgary, Canada (Calgary Tower)
    { lat: 43.942360, lng: 12.457777 },    // San Marino (Mount Titano)
    { lat: 30.267153, lng: -97.743057 },   // Austin, USA (Texas State Capitol)
    { lat: -22.906847, lng: -43.172896 },  // Rio de Janeiro, Brazil (Copacabana Beach)
    { lat: -33.448891, lng: -70.669266 },  // Santiago, Chile (Plaza de Armas)
    { lat: 47.376887, lng: 8.541694 },     // Zurich, Switzerland (Bahnhofstrasse)
    { lat: -20.163773, lng: 57.498389 },   // Mauritius (Le Morne Brabant)
  ];
  

    const choose = dict.at(getRandomInt(dict.length));
    return choose;
}

// Random number generator from 0 to dict.size - 1
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Initialize and export the window.
declare global {
  interface Window {
    initialize: () => void;
  }
}
window.initialize = initialize;

export {};
