/*
 * Created by Glen Eder - https://github.com/GlenEder
 *
 * This API is used to pull the latitude and longitude
 * coordinates from the GeoLite IPv4 data set.
 */

/*
 * getCords -- returns all coordinates in the data set within the bounds provided
 * @param mapBounds -- contains latLng objects of { _northEast, _southWest } corners
 *
 * @return -- array of cord objects { lat, lng, amt } (amt being the number of that specific coordinate in dataset)
 */
async function getCords(mapBounds) {

    //Stringify data to send to server
    let body = await JSON.stringify({
        northEast: mapBounds._northEast,
        southWest: mapBounds._southWest
    })

    //Request heat map cords from server
    let result = await fetch('/getcords', {method: 'post', headers: {'Content-Type': 'application/json'}, body})
    let data = await result.json()
    return data
}

/*
 * getSingleCordMax -- returns the largest amount of duplicate singles
 *
 * @return -- largest amount of single coordinate duplicates
 */
async function getSingleCordMax() {
    //Request heat map cords from server
    let result = await fetch('/getSingleCordMax', {method: 'post', headers: {'Content-Type': 'application/json'}})
    let data = await result.json()
    return data
}
