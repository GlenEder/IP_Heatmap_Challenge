//set to false to disable server logging to console
const serverLogs = true

//csv-parse
const csv = require('csv-parse')
const fs = require('fs')

//extract-zip
const extract = require('extract-zip')

//hashmap of coordinates we load in
let cords = new Map()

//flag for data having been loaded
let dataLoaded = false
//max amt for calls later
let maxSingleCordAmt = 0

async function initalizeData() {

    await extract('GeoLiteData.zip', {dir: process.cwd()})

    //read file
    fs.createReadStream('GeoLite2-City-CSV_20190618/GeoLite2-City-Blocks-IPv4.csv')
        .pipe(csv({})).on('data', data => {
        //only save the latitude and longitude values
        let lat = parseFloat(data[7])
        let lng = parseFloat(data[8])

        let key = lat + ":" + lng
        //check if coordinate already is in map
        if(cords.has(key)) {
            //get previous amount counter
            let newAmt = cords.get(key) + 1;

            //update max single cord amt
            if(newAmt > maxSingleCordAmt) maxSingleCordAmt = newAmt

            //update amount counter
            cords.set(key, {
                lat: lat,
                lng: lng,
                amt: newAmt
            })
        }
        else {
            //set coordinate to have 1 as amount if none already exist
            cords.set(key, {
                lat: lat,
                lng: lng,
                amt: 1
            })
        }
    })
        .on('end', numRows => {
            //set flag for data being loaded
            dataLoaded = true

            //print next ten cords for testing
            // printGeoLiteData(0, 200)
            //log data being loaded
            if(serverLogs) console.log("GeoLite Data Loaded: %d lines read, %d cords", numRows, cords.size)
        })

}

//call startup method
initalizeData()

//create express server
let express = require('express')
let app = express()
const port = process.env.PORT || 5000
app.use(express.json())

//initalize body parser for handling requests
let bodyParser = require('body-parser')
app.use(bodyParser.json())

//Landing page req
app.get('/', (req, res) => {
    if(serverLogs) console.log("Sending index.html to client...")
    res.sendFile('index.html', {root: 'client'})
})

//Clie
app.get('/main.css', (req, res) => {
    res.sendFile('main.css', {root: 'client'})
})

//Client script file
app.get('/client.js', (req, res) => {
    res.sendFile('client.js', {root: 'client'})
})

//Leaflet heatmap js file
app.get('/leaflet-heat.js', (req, res) => {
    res.sendFile('/node_modules/leaflet.heat/dist/leaflet-heat.js', {root: 'client'})
})

//Our LatLng api file
app.get('/IP_LatLng.js', (req, res) => {
    res.sendFile('/IP_LatLng.js', {root: 'src'})
})



//Call to get cords in range specified by req.body
//body { topLeft, bottomRight }
app.post('/getCords', (req, res) => {

    //Access values user sent
    let north = req.body.northEast.lat
    let east = req.body.northEast.lng
    let south = req.body.southWest.lat
    let west = req.body.southWest.lng

    //find cords and send results
    getCords(north, south, west, east, results => {
        res.send(results)
    })
})

//Call to get the single coordinate max amount
app.post('/getSingleCordMax', (req, res) => {
    res.send({max: maxSingleCordAmt})
})




//Initialize server
let server = app.listen(port, () => {
    let host = server.address().address
    let port = server.address().port

    console.log("Server listening @ http://%s:%s", host, port)
})


/*
 * Returns all cords in the area designated
 * @param top -- top-most latitude
 * @param bottom -- bottom-most latitude
 * @param left -- left-most  longitude
 * @param right -- right-most longitude
 * @param callback -- method called when method completes
 */
function getCords(top, bottom, left, right, callback) {

    //ensure data has been loaded, return if not
    if(!dataLoaded) {
        if(serverLogs) console.log("ERROR: GeoLite data not loaded")
        callback([])
        return
    }

    if(serverLogs) console.log("Finding cords within %d,%d -- %d,%d", left, top, right, bottom)
    //create array to store valid cords
    let region = [];

    //loop through cords and find matches
    for(let [key, val] of cords) {

        //store value object for easier reading
        let lat = val.lat
        let lng = val.lng
        let amt = val.amt

        //check latitude value
        if(lat >= bottom && lat <= top) {
            //check longitude
            if(lng >= left && lng <= right) {
                region.push({lat: lat, lng: lng, amt: amt})
            }
        }

    }

    //print valid lat cords for debugging
    // printGeoLiteData(start, currCord - start)

    //use callback to send valid coordinates
    if(serverLogs) console.log("getCords: Found %d IP addresses in region", region.length)
    callback(region)
}

/*
 * Prints desired number of lines in the cords array
 * @param start -- starting cord position to print
 * @param numLines -- number of coordinates to print
 */
function printGeoLiteData(start, numLines) {

    //check that data has loaded
    if(!dataLoaded) {
        console.log("ERROR: GeoLite data not loaded")
        return
    }

    //print desired lines of data
    console.log("===GeoLite Data===")
    for(let i = 0; i < numLines; i++) {
        console.log("%d: (%d, %d)", start + i, cords[start + i].lng, cords[start + i].lat)
    }


}