//set to false to disable server logging to console
const serverLogs = true

//csv-parse
const csv = require('csv-parse')
const fs = require('fs')
const cords = []

//flag for data having been loaded
let dataLoaded = false

//read file
fs.createReadStream('../GeoLite2-City-CSV_20190618/GeoLite2-City-Blocks-IPv4.csv')
    .pipe(csv({})).on('data', data => {
        //only save the latitude and longitude values
        let cord = {
            lat: parseFloat(data[7]),
            long: parseFloat(data[8])
        }

        //save cords to results
        cords.push(cord)
    })
    .on('end', () => {
        //sort by lat for easier lookup
        cords.sort( (a,b) => {return a.lat > b.lat ? 1 : -1} )
        //set flag for data being loaded
        dataLoaded = true

        //print next ten cords for testing
        // printGeoLiteData(0, 200)
        //log data being loaded
        if(serverLogs) console.log("GeoLite Data Loaded")
    })


//create express server
let express = require('express')
let app = express()
app.use(express.json())

//initalize body parser for handling requests
let bodyParser = require('body-parser')
app.use(bodyParser.json())

//Landing page req
app.get('/', (req, res) => {
    if(serverLogs) console.log("Sending index.html to client...")
    res.sendFile('index.html', {root: '../client'})
})

//Clie
app.get('/main.css', (req, res) => {
    res.sendFile('main.css', {root: '../client'})
})

//Client script file
app.get('/client.js', (req, res) => {
    res.sendFile('client.js', {root: '../client'})
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




//Initialize server
let server = app.listen(8000, () => {
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

    //create object to loop though cords array
    let currCord = 0

    //move to first valid latitude in cords[]
    while(cords[currCord].lat < bottom) currCord++;

    //get starting valid lat cord for debugging
    let start = currCord

    //loop till latitude exceeds max
    while(cords[currCord].lat < top) {

        //save local copy of longitude for comparisons
        let longitude = cords[currCord].long

        //check latitude value
        if(longitude >= left && longitude <= right) {
            //add coordinate to region array
            region.push(cords[currCord])
        }

        //go to next cord in array
        currCord++
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
        console.log("%d: (%d, %d)", start + i, cords[start + i].long, cords[start + i].lat)
    }


}