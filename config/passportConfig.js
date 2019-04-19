// Include the variables from .env
require('dotenv').config()

// Require passport and any passport strategies you wish to use
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy 
let FacebookStrategy = require('passport-facebook').Strategy

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
	usernameField: 'email',
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
}))

// Set up Facebook Strategy
passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID,
	clientSecret: process.env.FACEBOOK_APP_SECRET,
	callbackURL: process.env.BASE_URL + '/auth/callback/facebook',
	profileFields: ['id', 'email', 'displayName', 'photos'],
	enableProof: true
}, (FacebookAccessToken, refreshToken, profile, callback) => {
	// Grab the primary email
	let facebookEmail = profile.emails.length ? profile.emails[0] : ''

	// Look for the email facebook gave us in our local database
	db.user.findOne({
		where: { email: facebookEmail }
	})
	.then((existingUser) => {
		if (existingUser && facebookEmail) {
			// This is a returning user - just update their facebook id and token
			existingUser.update({
				facebookId: profile.id,
				facebookToken: FacebookAccessToken
			})
			.then((updatedUser) => {
				callback(null, updatedUser)
			})
			.catch(callback)
		} else {
			// This is a new user - we need to create them
			let userNameArr = profile.displayName.split(' '),
			let photo = profile.photos.length ? profile.photos[0] : 
			db.user.findOrCreate({
				where: { facebookId: profile.id },
				defaults: {
					facebookToken: FacebookAccessToken,
					email: facebookEmail,
					firstname: userNameArr[0],
					lastname: userNameArr[userNameArr.length - 1],
					birthdate: profile.birthday,
					image: photo,
					bio: 'This account was created with Facebook'
				}
			})
			.spread((foundOrCreatedUser, wasCreated) => {
				callback(null, foundOrCreatedUser)
			})
			.catch(callback)
		}
	})
}))

// Make sure I can use this file in other pages
module.exports = passport












