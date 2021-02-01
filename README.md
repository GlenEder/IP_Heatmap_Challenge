# IP_Heatmap_Challenge

Using the GeoLite2 City CSV data, render a heat map of the IPv4 locations

## Demo Link

https://heatmap-challenge.herokuapp.com

## IP_LatLng API 

#### To use the API, download and link the file: `IP_LatLng.js`

###### Found inside `src` directory

### Methods

1. `getCords(mapBounds)`  
    - returns an array of objects that contains
        1. lat - latitude of coordinate
        2. lng - longitude of coordinate
        3. amt - number of times coordinate appears in loaded dataset
    
2. `getSingleMaxCord()`  
    - returns the max number of times a single coordinate appears in loaded dataset
   
   
### Steps taken
1. Research API's noted in problem pdf 
   - [MapBox](https://www.mapbox.com/)
   - [Leaflet](https://leafletjs.com/)
   - [Leaflet.heatmap](https://github.com/Leaflet/Leaflet.heat)
   
2. Create a basic client to test with 
   - Use Mapbox & Leaflet to render map
   
3. Create express server for API calls
   - Express was used for simplicity and ease of deployment
   
4. Parse GeoLiteData
   - Found package [csv-parse](https://www.npmjs.com/package/csv-parse)
   - Stored lat & lng in a hashmap along with the number of occurrences of that point in dataset
   
5. Connect Client and Server 
   - Tested sending data back and forth between the server and client 
   
6. Create custom API file 
   - Moved server calls into api file for distribution and use
   
7. Host express server 
   - Linked github repo with [Heroku](https://www.heroku.com/)
   
8. Upload and Unzip csv data on server startup
   - Had to upload zip file of data due to github file restrictions
   - Used [extract-zip](https://www.npmjs.com/package/extract-zip) to decompress zipped data
