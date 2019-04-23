// Include .env variables
require('dotenv').config()

// Require needed modules
let async = require('async')
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
	// console.log(req.body.lat, req.body.lng)
	var url = process.env.API_URL_GEO + 'lat=' + userLat + '&lng=' + userLong + '&key=' + process.env.API_KEY
	// console.log(url)
	var results = []

	request(url, (error, response, body) => {
		if (error) {
			console.log('error: ', error)
			console.log('status code: ', response.statusCode)
			res.send('ahh shit')
		} else {
			// Cool - we probably have some results
			var results = JSON.parse(body)
			// console.log(results)
			res.render('breweries/results', { results: results })
		}
	})
})

// // GET /beers show beers for a specific brewery
// router.get('/:brewery/beers', (req, res) => {
	
// })

// GET /:brewery/beers/:id

// GET /:id show a specific brewery
router.get('/:id', (req, res) => {
	var breweryUrl = process.env.API_URL_BREWERY + req.params.id + '/?key=' + process.env.API_KEY
	// console.log(breweryUrl)
	// Use request to call the API
	request(breweryUrl, (error, response, body) => {
		if (error) {
			console.log('error: ', error)
			// console.log('status code: ', response.statusCode)
			res.send('ahh shit')
		} else {
			var breweryLocationsURL = process.env.API_URL_BREWERY + req.params.id + '/locations/?key=' + process.env.API_KEY
			var results = JSON.parse(body)
			locations(breweryLocationsURL, body, results, res)
			console.log(breweryLocationsURL)
			// res.render('breweries/show', { results: results.data })
		}
	})
})
let locations = (breweryLocationsURL, data, results, res) => {
	request(breweryLocationsURL, (error, response, body) => {
		if (error) {
			console.log('error: ', error)
			// console.log('status code: ', response.statusCode)
		} else {
			var results2 = JSON.parse(body)
			console.log(results2.data)
			res.render('breweries/show', { results: results.data, results2: results2.data })
		}
	})	
}


// Export the routes from this file
module.exports = router