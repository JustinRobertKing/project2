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
	db.brewery.findAll({
		where: { userId: req.user.id },
		include: [db.beer]
	})
	.then((breweries) => {
		console.log(breweries)
		res.render('profile/index', { breweries: breweries })
	})
})

// GET /profile/admin
router.get('/admin', adminLoggedIn, (req, res) => {
	res.render('profile/admin')
})

// PUT /profile edit your bio
router.put('/', (req,res) => {
	db.user.update({
		bio: req.body.bio
	}, {
		where: { id: req.user.id }
	})
	.then((updatedUser) => {
		res.redirect('/profile')
	})
})

// Export the routes from this file
module.exports = router