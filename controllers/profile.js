// Require needed modules
let express = require('express')

// Declare an express router
let router = express.Router()

// Reference the models
let db = require('../models')

// Include our custom middleware to ensure that users are logged in
let adminLoggedIn = require('../middleware/adminLoggedIn')
let loggedIn = require('../middleware/loggedIn')

// Declare routs
router.get('/', loggedIn, (req, res) => {
	res.render('profile/index')
})

// GET /profile/breweries
router.get('/breweries', (req, res) => {
	res.send('profile/breweries stub')	
})

// GET /profile/breweries/beers
router.get('/breweries/beers', (req, res) => {
	res.send('profile/breweries/beers stub')	
})

// GET /profile/admin
router.get('/admin', adminLoggedIn, (req, res) => {
	res.render('profile/admin')
})

// Export the routes from this file
module.exports = router