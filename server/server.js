
//create express server
let express = require('express')
let app = express()

//Landing page req
app.get('/', (req, res) => {
    res.sendFile('index.html', {root: '../client'})
})


//Initialize server
let server = app.listen(8000, () => {
    let host = server.address().address
    let port = server.address().port

    console.log("Server listening @ http://%s:%s", host, port)
})
