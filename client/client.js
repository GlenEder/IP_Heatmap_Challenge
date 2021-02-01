
//Leaflet map object
let map;
//Leaflet-heat object
let heat;

window.addEventListener('load', () => {

    //Create map with starting cords of the U S of A
    map = L.map('mapid').setView([39.74, -93.9771], 5)

    //Apply mapbox styling to the map
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        minZoom: 3,
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZy1lZGVyIiwiYSI6ImNra2VpMmZnNDAwZ2wydm80dHlxcGEwNmoifQ.t6Gkk15Y0w7qU7WMdBPLZA'
    }).addTo(map);

    //get bounds data after zoom
    map.on('zoomend', e => {
        loadMap()
    })

    //get bounds data after move
    map.on('moveend', e => {
        loadMap()
    })

    //fetch data and render
    loadMap()

})

async function loadMap() {

    //show loading overlay
    JsLoadingOverlay.show({spinnerIcon: 'ball-pulse'})

    //Get inital bounds and get heatmap data
    let bounds = map.getBounds()
    let success = await getHeatmapCords(bounds)

    //if data didnt load reload map in 2 second
    if(!success) setTimeout(loadMap, 2000)
    else JsLoadingOverlay.hide()
}


async function getHeatmapCords(mapBounds) {

    //Get cords from API call
    let dataReceived = await getCords(mapBounds)

    //create heatmap with cords received from server
    return createHeatMap(dataReceived)

}

function createHeatMap(heatmapCords) {

    if(heatmapCords.length == 0) return false

    //if heatmap already exists, update cords and redraw
    if(heat) {
        heat.setLatLngs(heatmapCords)
        heat.redraw()
    }
    //create heatmap and add to our map
    else {
        heat = L.heatLayer(heatmapCords, {radius: 25, gradient: {0.3: 'blue', 0.4: 'lime', 1: 'red'}, maxZoom: 12}).addTo(map)
    }

    return true

}

