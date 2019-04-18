// Require passport and any passport strategies you wish to use
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy 

// Reference to the models
let db = require('../models')

// Provide serialization/deserialization functions for passport to use
// This allows passport to store the user by the id alone (serialize the user)
// and look up the full information about a user from the id (deserialize the user)
passport.serializeUser((user, callback) => {
	// callback(errorMessage - null if none, userData - the id only in this case)
	callback(null, user.id)
})

passport.deserializeUser((id, callback) => {
	db.user.findByPk(id)
	.then((user) => {
		// callback(errorMessage - null if none, userData - the id only in this case)
		callback(null, user)
	})
	.catch((error) => {
		console.log('error', error)
	})
})

// Set up the LocalStrategy
passport.use(new LocalStrategy({
	usernameField: 'email'
	passwordField: 'password'
}, (email, password, callback) => {
	// Try to look up the user by email
	db.user.findOne({
		where: { email: email }
	})
	.then((foundUser) => {
		// If I didn't find a user OR if I did find a user and they have a bad password
		if (!foundUser || !foundUser.validPassword(password)) {
			// Uh-oh this is a bad user
			callback(null, null)
		} else {
			// This one is a valid user
			callback(null, foundUser)
		}
	})
	.catch((error) => {
		console.log('error', error)
	})
})

// Make sure I can use this file in other pages
module.exports = passport












