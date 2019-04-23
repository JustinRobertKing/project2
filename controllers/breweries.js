// Include .env variables
require('dotenv').config()

// Require needed modules
let express = require('express')
let request = require('request')
let mapBoxClient = require('@mapbox/mapbox-sdk')
let mapBoxGeocode = require('@mapbox/mapbox-sdk/services/geocoding')
let router = express.Router()
let db = require('../models')

// Give mapbox our key
const mapBoxKey = process.env.MAPBOX_KEY
const mb = mapBoxClient({ accessToken: mapBoxKey })
const geocode = mapBoxGeocode(mb)

let userLat = 39.4817
let userLong = -106.0384

router.get('/', (req, res) => {
	res.render('breweries/index')	
})

router.post('/results', (req, res) => {
	console.log(req.body.lat, req.body.lng)
	var url = process.env.API_URL_GEO + 'lat=' + userLat + '&lng=' + userLong + '&key=' + process.env.API_KEY
	// console.log(url)
	var results = []

	request(url, (error, response, body) => {
		if (error) {
			// Sum Ting Wong
			// console.log('error: ', error)
			// console.log('status code: ', response.statusCode)
			res.send('ahh shit')
		} else {
			// Cool - we probably have some results
			var results = JSON.parse(body)
			// console.log(results)
			// res.send(results)
			res.render('breweries/results', { results: results })
		}
	})
})

// GET /beers show beers for a specific brewery
router.get('/:brewery/beers', (req, res) => {
	
})

// GET /:brewery/beers/:id

// GET /:id show a specific brewery


// Export the routes from this file
module.exports = router