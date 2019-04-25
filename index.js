// Include .env variables
require('dotenv').config()

// Require necessary modules
let express = require('express')
let flash = require('connect-flash')
let layouts = require('express-ejs-layouts')
let methodOverride = require('method-override')
let session = require('express-session')

// Include passport configuration
let passport = require('./config/passportConfig')

// Declare Express app
let app = express()

// Set view engine
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))

// Include (use) middleware
app.use('/', express.static('static'))
app.use(layouts)
app.use(express.urlencoded({ extended: false }))
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// Custom middleware - write data to locals on EVERY page
app.use((req, res, next) => {
	res.locals.alerts = req.flash()
	res.locals.user = req.user
	next()
})

// Include routes from controllers
app.use('/auth', require('./controllers/auth'))
app.use('/profile', require('./controllers/profile'))
app.use('/breweries', require('./controllers/breweries'))

// Make a home route: GET /
app.get('/', (req, res) => {
	res.render('home')
})

// Catch-all route - render the 404 page
app.get('*', (req, res) => {
	res.render('404')
})

// Listen from your port
app.listen(process.env.PORT || 3000)