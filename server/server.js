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
            lat: data[7],
            long: data[8]
        }

        //save cords to results
        cords.push(cord)
    })
    .on('end', () => {
        //sort by lat for easier lookup
        cords.sort( (a,b) => {return a.lat > b.lat ? 1 : -1} )
        //set flag for data being loaded
        dataLoaded = true

        //log data being loaded
        if(serverLogs) console.log("GeoLite Data Loaded")
    })


//create express server
let express = require('express')
let app = express()

//initalize body parser for handling requests
let bodyParser = require('body-parser')
app.use(bodyParser.json())

//Landing page req
app.get('/', (req, res) => {
    if(serverLogs) console.log("Sending index.html to client...")
    res.sendFile('index.html', {root: '../client'})
})

//Client css file
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
    let top = req.body.topLeft[1]
    let left = req.body.topLeft[0]
    let bottom = req.body.bottomRight[1]
    let right = req.body.bottomRight[0]

    //log request
    if(serverLogs) console.log("Finding cords within %d,%d -- %d,%d", left, top, right, bottom)

    getCords(left, top, right, bottom, results => {
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
 * @param left -- min longitude
 * @param top -- max latitude
 * @param right -- max longitude
 * @param bottom -- min latitude
 * @param callback -- method called when method completes
 */
function getCords(left, top, right, bottom, callback) {

    //ensure data has been loaded, return if not
    if(!dataLoaded) {
        if(serverLogs) console.log("ERROR: GeoLite data not loaded")
        callback([])
        return
    }

    //create array to store valid cords
    let region = [];

    //create object to loop though cords array
    let currCord = 0

    //move to first valid latitude in cords[]
    while(cords[currCord].lat < bottom) currCord++

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

    //use callback to send valid coordinates
    if(serverLogs) console.log("getCords: Found %d IP addresses in region", region.length)
    callback(region)
}