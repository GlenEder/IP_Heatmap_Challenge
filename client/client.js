
window.addEventListener('load', () => {

    //Create map with starting cords of indy b/c indy I guess
    let map = L.map('mapid').setView([39.791, -86.148], 13)

    //Apply mapbox styling to the map
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZy1lZGVyIiwiYSI6ImNra2VpMmZnNDAwZ2wydm80dHlxcGEwNmoifQ.t6Gkk15Y0w7qU7WMdBPLZA'
    }).addTo(map);

})


