
const assert = require('assert')
const api = require('/src/IP_LatLng')

/* Test 1
 * Asserts that no cords are returned with null params sent
 */
function test1 () {
    assert(api.getCords(null, null))
}

