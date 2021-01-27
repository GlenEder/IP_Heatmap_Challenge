//set to false to disable server logging to console
const serverLogs = true

//csv-parse
const csv = require('csv-parse')
const fs = require('fs')
const cords = []

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

        if(serverLogs) console.log("GeoLite Data Loaded")
    })


//create express server
let express = require('express')
let app = express()

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


/*==Never call this again, will crash browsers==*/
app.get('/allCords', (req, res) => {
    if(serverLogs) console.log("Sending all coordinates loaded...")

    //null check on cords
    if(cords === undefined || cords === null) res.send([])
    else res.send(cords)
})


//Call to get cords in range specified by req.body
//body { topLeft, bottomRight }
app.post('/getCords', (req, res) => {

    //Access values user sent
    let top = req.body.topLeft[1]
    let left = req.body.topLeft[0]
    let bottom = req.body.bottomRight[1]
    let right = req.body.bottomRight[0]

    if(serverLogs) console.log("Finding cords within %d,%d -- %d,%d", left, top, right, bottom)

    res.send([])
})




//Initialize server
let server = app.listen(8000, () => {
    let host = server.address().address
    let port = server.address().port

    console.log("Server listening @ http://%s:%s", host, port)
})


