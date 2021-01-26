
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
