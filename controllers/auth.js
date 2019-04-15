// Require needed modules
let express = require('express')

// Declare an express router
let router = express.Router()

// Declare routs
router.get('/login', (req, res) => {
	res.render('auth/login')
})

router.post('/login', (req, res) => {
	console.log(req.body)
	res.send('POSTed to auth/login')
})

router.get('/signup', (req, res) => {
	res.render('auth/signup')
})

router.post('/signup', (req, res) => {
	console.log(req.body)
	if (req.body.password !== req.body.password_verify) {
		console.log("\"" + req.body.password + "\"" + ' does not match ' + "\"" + req.body.password_verify + "\"")
		req.flash('error', 'Passwords do not match')
		res.redirect('/auth/signup')
	} else {
		req.flash('success', "You successfully did a thing")
		res.redirect('/')
	}
})

// Export the router object so that the routes can be used
module.exports = router