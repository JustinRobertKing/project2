// Require needed modules
let express = require('express')

// Declare an express router
let router = express.Router()

// Reference the models
let db = require('../models')

// Reference to passport so we can use the authenticate function
let passport = require('../config/passportConfig')

// Declare routs
router.get('/login', (req, res) => {
	res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	successFlash: 'Login Successfull!',
	failureRedirect: '/auth/login',
	failureFlash: 'Invalid Credentials'
}))

router.get('/signup', (req, res) => {
	res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
	console.log(req.body)
	if (req.body.password !== req.body.password_verify) {
		console.log("\"" + req.body.password + "\"" + ' does not match ' + "\"" + req.body.password_verify + "\"")
		req.flash('error', 'Passwords do not match')
		res.redirect('/auth/signup')
	} else {
		db.user.findOrCreate({
			where: { email: req.body.email },
			defaults: req.body
		})
		.spread((user, wasCreated) => {
			if (wasCreated) {
				// Automatically log the new user in
				passport.authenticate('local', {
					successRedirect: '/profile',
					successFlash: 'Login Successfull!',
					failureRedirect: '/auth/login',
					failureFlash: 'Invalid Credentials'
				})(req, res, next)
			} else {
				req.flash('error', 'Account already exists; please log in')
				res.redirect('/auth/login')
			}
		})
		.catch((error) => {
			// Print all error info to the terminal (not okay for the user to see)
			console.log('Error in POST /auth/signup:', error)
			// Generic error for all cases
			req.flash('error', 'Something went wrong')
			// Validation-specific errors (okay to show the user)
			if (error && error.errors) {
				error.errors.forEach((e) => {
					if (e.type == 'Validation error') {
						req.flash('error', 'Validation issue - ' + e.message)
					}
				})
			}
			res.redirect('/auth/signup')
		})
	}
})

// GET /auth/logout 
router.get('/logout', (req, res) => {
	req.logout()
	req.flash('success', 'Logout Successfull')
	res.redirect('/')
})

/* FACEBOOK SPECIFIC ROUTES */
// GET /auth/facebook (outgoing request to facebook)
router.get('/facebook', passport.authenticate('facebook', {
	scope: ['public_profile', 'email', 'user_birthday']
}))

// GET /auth/callback/facebook (incoming data from facebook)
router.get('/callback/facebook', passport.authenticate('facebook', {
	successRedirect: '/profile',
	successFlash: 'Facebook Login Successfull',
	failureRedirect: 'auth/login',
	failureFlash: 'Facebook Login Failed'
}))








// Export the router object so that the routes can be used
module.exports = router