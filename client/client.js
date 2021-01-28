
//Leaflet map object
let map;

window.addEventListener('load', () => {

    //Create map with starting cords of indy b/c indy I guess
    map = L.map('mapid').setView([39.791, -86.148], 13)

    //Apply mapbox styling to the map
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZy1lZGVyIiwiYSI6ImNra2VpMmZnNDAwZ2wydm80dHlxcGEwNmoifQ.t6Gkk15Y0w7qU7WMdBPLZA'
    }).addTo(map);

    //Get inital bounds and get heatmap data
    let bounds = map.getBounds()
    getHeatmapCords(bounds)

    //get bounds data after zoom
    map.on('zoomend', e => {
        let newBounds = map.getBounds()
        getHeatmapCords(newBounds)
    })

    //get bounds data after move
    map.on('moveend', e => {
        let newBounds = map.getBounds()
        getHeatmapCords(newBounds)
    })

})

async function getHeatmapCords(mapBounds) {

    //Stringify data to send to server
    let body = await JSON.stringify({
        northEast: mapBounds._northEast,
        southWest: mapBounds._southWest
    })

    console.log(body)

    let result = await fetch('/getcords', {method: 'post', headers: {'Content-Type': 'application/json'}, body})
    let dataRecieved = await result.json()
    console.log(dataRecieved)

}


//Test call to server
async function testCall() {
    let cordA = [39.6, -51.1]
    let cordB = [49.9, -53.3]
    let body = await JSON.stringify({
        northEast: cordA,
        southWest: cordB
    })
    let result = await fetch('/getcords', {method: 'post', headers: {'Content-Type': 'application/json'}, body})
    let dataRecieved = await result.json()
    console.log(dataRecieved)

}
