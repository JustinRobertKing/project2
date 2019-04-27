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
let loggedIn = require('../middleware/loggedIn')
let results, results2, results3;

// Give mapbox our key
const mapBoxKey = process.env.MAPBOX_KEY
const mb = mapBoxClient({ accessToken: mapBoxKey })
const geocode = mapBoxGeocode(mb)

let userLat = 38.2324
let userLong = -122.6367

router.get('/', (req, res) => {
	res.render('breweries/index')	
})

router.post('/results', (req, res) => {
	console.log(req.body.lat, req.body.lng)
	userLat = req.body.lat
	userLong = req.body.lng

	var url = process.env.API_URL_GEO + 'lat=' + userLat + '&lng=' + userLong + '&key=' + process.env.API_KEY
	// console.log(url)
	var results = []

	request(url, (error, response, body) => {
		if (error) {
			console.log('error: ', error)
			console.log('status code: ', response.statusCode)
			res.send('ahh shit')
		} else {
			var results = JSON.parse(body)
			console.log(results)
			let markers = results.data.map((b) => {
				let markerObj = {
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [b.longitude, b.latitude]
					},
					"properties": {
						"title": b.brewery.nameShortDisplay,
						"icon": "beer"
					}
				}
				return JSON.stringify(markerObj)
			})
			res.render('breweries/results', { results: results, mapkey: mapBoxKey, markers, userLong, userLat})
		}
	})
})

// POST /:id
router.post('/:id', (req, res) => {
	if (req.user) {
		// database writer to faves
		db.brewery.findOrCreate({
			where: { 
				apiId: req.body.breweryApiId, 
				userId: req.user.id
			},
			defaults: {
				apiId: req.body.breweryApiId,
		      	name: req.body.breweryName,
		      	established: req.body.established, 
		      	imageUrl: req.body.breweryImageUrl, 
		      	website: req.body.website,
		      	description: req.body.description, 
		      	isInBusiness: req.body.isInBusiness,
		      	status: req.body.status,
		      	userId: req.user.id
			}
		})
		.spread((butts, wasCreated) => {
			if (!db.beer.findAll({where: { breweryId: butts.id }})) {
				console.log('wasCreated was:', butts.id, wasCreated)
				res.status(200).send('success')
				return
			}
			console.log('ABC - making beers', butts, wasCreated)
			db.beer.findOrCreate({
				where: {
					name: req.body.name,
					userId: req.user.id
				},
				defaults: {
					apiId: req.body.apiId,
					breweryId: req.body.breweryId,
					name: req.body.name,
					style: req.body.style,
					imageUrl: req.body.imageUrl,
					ibu: req.body.ibu ? parseInt(req.body.ibu) : null,
					abv: req.body.abv ? parseInt(req.body.abv) : null,
					availability: req.body.availability,
					breweryId: butts.id,
					userId: req.user.id
				}
			})
			.spread((balls, wasCreated) => {
				console.log('balls', balls, wasCreated)
				res.status(200).send('success')
			})
		})
		// console.log(req.body, req.user.id)
	}
	else {
		console.log('faillll')
		res.status(401).send('NOOOOOOOOO - unauthorized')
	}
		
})

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
			results = JSON.parse(body)
			locations(breweryLocationsURL, body, results, req, res)
			console.log(breweryLocationsURL)
		}
	})
})

let locations = (breweryLocationsURL, data, results, req, res) => {
	request(breweryLocationsURL, (error, response, body) => {
		if (error) {
			console.log('error: ', error)
			// console.log('status code: ', response.statusCode)
		} else {
			var breweryBeersURL = process.env.API_URL_BREWERY + req.params.id + '/beers/?key=' + process.env.API_KEY
			results2 = JSON.parse(body)
			// console.log(results2.data)
			beers(breweryBeersURL, body, results, results2, res)
		}
	})	
}

let beers = (breweryBeersURL, data, results, results2, res) => {
	request(breweryBeersURL, (error, response, body) => {
		if (error) {
			console.log('error: ', error)
			// console.log('status code: ', response.statusCode)
		} else {
			results3 = JSON.parse(body)
			console.log(results3)
			res.render('breweries/show', {
				results: results.data,
				results2: results2.data,
				results3: results3.data,
			})
		}
	})	
}

// .then((faves) => {
// 		// TODO create an array of geojson data
// 		let markers = faves.map((city) => {
// 			let markerObj = {
// 				"type": "Feature",
// 				"geometry": {
// 					"type": "Point",
// 					"coordinates": [city.long, city.lat]
// 				},
// 				"properties": {
// 					"title": city.name,
// 					"icon": "airport"
// 				}
// 			}
// 			return JSON.stringify(markerObj)
// 		})
// 		res.render('cities/faves', { faves, mapkey: mapBoxKey, markers })
// 	})
// 	.catch((error) => {
// 		console.log('error', error)
// 	})

// Export the routes from this file
module.exports = router