# IP_Heatmap_Challenge

Using the GeoLite2 City CSV data, render a heat map of the IPv4 locations

##Demo Link

https://heatmap-challenge.herokuapp.com

## IP_LatLng API 

#### To use the API, download and link the file: `IP_LatLng.js`

###### Found inside `src` directory

###Methods

1. `getCords(mapBounds)`  
    - returns an array of objects that contains
        1. lat - latitude of coordinate
        2. lng - longitude of coordinate
        3. amt - number of times coordinate appears in loaded dataset
    
2. `getSingleMaxCord()`  
    - returns the max number of times a single coordinate appears in loaded dataset
    
