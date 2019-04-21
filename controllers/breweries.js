// Include .env variables
require('dotenv').config()

// Require needed modules
let express = require('express')
let request = require('request')
let router = express.Router()
let db = require('../models')


let userLat = 39.4817
let userLong = -106.0384
// let x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(updatePosition);
  } else { 
    x.textContent = "Geolocation is not supported by this browser.";
  }
}

function updatePosition(position) {
  userLat = position.coords.latitude
  userLong = position.coords.longitude
}

router.get('/', (req, res) => {
	res.render('breweries/index')	
})

router.post('/results', (req, res) => {
	// if (req.body.query) {
	// 	getLocation()
	// }
	var url = process.env.API_URL_GEO + 'lat=' + userLat + '&lng=' + userLong + '&key=' + process.env.API_KEY
	console.log(url)
	var results = []

	request(url, (error, response, body) => {
		if (error) {
			// Sum Ting Wong
			console.log('error: ', error)
			console.log('status code: ', response.statusCode)
			res.send('ahh shit')
		} else {
			// Cool - we probably have some results
			var results = JSON.parse(body)
			console.log(results.data)
			res.render('breweries/results', { results: results })
		}
	})
})

// Export the routes from this file
module.exports = router