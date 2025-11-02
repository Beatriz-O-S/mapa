

const map = L.map("mapid").setView([0, 0], 2); // [lat, lng], zoom


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);


let userMarker = null;
let userCircle = null; 
const customMarkers = [];

function onLocationUpdate(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const accuracy = position.coords.accuracy;
  const latLng = [lat, lng];

  
  if (!userMarker) {
    map.setView(latLng, 16); 
  }

  
  if (userMarker) {
    userMarker.setLatLng(latLng);
  } else {
    
    const currentLocIcon = L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    userMarker = L.marker(latLng, { icon: currentLocIcon })
      .addTo(map)
      .bindPopup("Você está aqui! (Posição Atual)")
      .openPopup();
  }

  
  if (userCircle) {
    userCircle.setLatLng(latLng).setRadius(accuracy);
  } else {
    userCircle = L.circle(latLng, { radius: accuracy, color: '#136AEC', fillColor: '#136AEC', fillOpacity: 0.2 }).addTo(map);
  }

  console.log(`Nova posição: Lat ${lat}, Lng ${lng}, Precisão: ${accuracy}m`);
}

function onLocationError(error) {
  let message = "";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "Permissão de geolocalização negada pelo usuário.";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "Informação de localização indisponível.";
      break;
    case error.TIMEOUT:
      message = "Tempo limite excedido ao tentar obter a localização.";
      break;
    default:
      message = "Um erro desconhecido ocorreu: " + error.message;
      break;
  }
  alert("Erro de Geolocalização: " + message);
}


const watchOptions = {
  enableHighAccuracy: true, 
  timeout: 5000, 
  maximumAge: 0, 
};


if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    onLocationUpdate,
    onLocationError,
    watchOptions
  );
} else {
  alert("Seu navegador não suporta Geolocalização.");
}


function addCustomMarker(e) {
    const latlng = e.latlng;


    const markerName = prompt("Digite um nome para a marcação:");

    if (markerName) {
        
        const customIcon = L.icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        const newMarker = L.marker(latlng, { icon: customIcon })
            .addTo(map)
            .bindPopup(`<b>${markerName}</b><br>Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`)
            .openPopup();
        
        
        customMarkers.push(newMarker);
        
        console.log(`Marcação "${markerName}" adicionada em: ${latlng.lat}, ${latlng.lng}`);

    } else {
        alert("Marcação cancelada ou nome não fornecido.");
    }
    
    
    map.off('click', addCustomMarker);
    
    document.getElementById('addMarkerBtn').textContent = "➕ Adicionar Marcação";
    document.getElementById('addMarkerBtn').style.backgroundColor = "#0078A8";
}



document.getElementById('addMarkerBtn').addEventListener('click', function() {
    alert("Clique no mapa onde você deseja adicionar a marcação.");
    
    
    this.textContent = "📍 Clique no Mapa...";
    this.style.backgroundColor = "darkred";

    map.once('click', addCustomMarker); 

});