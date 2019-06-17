// Require needed modules
let express = require('express')

// Declare an express router
let router = express.Router()

// Reference the models
let db = require('../models')

// Include our custom middleware to ensure that users are logged in
let adminLoggedIn = require('../middleware/adminLoggedIn')
let loggedIn = require('../middleware/loggedIn')

// Declare routes
router.get('/', loggedIn, (req, res) => {
	db.brewery.findAll({
		where: { userId: req.user.id },
		include: [db.beer]
	})
	.then((breweries) => {
		// console.log(breweries)
		res.render('profile/index', { breweries: breweries })
	})
	.catch((error) => {
		console.log('error', error)
	})
})

// GET /profile/admin
router.get('/admin', adminLoggedIn, (req, res) => {
	res.render('profile/admin')
})

// PUT /profile edit your bio
router.put('/', (req,res) => {
	if (req.user) {
		db.user.update({
			bio: req.body.bio
		}, {
			where: { id: req.user.id }
		})
		.then((updatedUser) => {
			res.redirect('/profile')
		})
		.catch((error) => {
			console.log('error', error)
		})
	} else {
		res.redirect('/auth/login')
	}
})

router.delete('/beers', (req, res) => {
	console.log('delete beers route', req.body)
	db.beer.destroy({ 
		where: { 
			id: req.body.id,	
			userId: req.user.id
		}
	})
	.then((deletedBeer) => {
		res.status(200).send('success')
	})
	.catch((error) => {
		console.log('error', error)
	})
})

router.delete('/breweries', (req, res) => {
	console.log('delete breweries route', req.body)
	db.beer.destroy({ 
		where: { 
			breweryId: req.body.id,
			userId: req.user.id 
		}
	})
	.then((deletedBeers) => {
		db.brewery.destroy({
			where: {
				id: req.body.id,
				userId: req.user.id
			}
		})
		.then((deletedBrewery) => {
			res.status(200).send('success')
		})
	})
	.catch((error) => {
		console.log('error', error)
	})
})

// Export the routes from this file
module.exports = router