
//csv-parse
const csv = require('csv-parse')
const fs = require('fs')
const results = []

//read file
fs.createReadStream('../GeoLite2-City-CSV_20190618/GeoLite2-City-Blocks-IPv4.csv')
    .pipe(csv({})).on('data', data => results.push(data))
    .on('end', () => {
        console.log("GeoLite Data Loaded")
    })


//create express server
let express = require('express')
let app = express()

//Landing page req
app.get('/', (req, res) => {
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




//Initialize server
let server = app.listen(8000, () => {
    let host = server.address().address
    let port = server.address().port

    console.log("Server listening @ http://%s:%s", host, port)
})


