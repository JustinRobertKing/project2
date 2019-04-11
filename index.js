// Include .env variables
require('dotenv').config()

// Require necessary modules
let express = require('express')
let layouts = require('express-ejs-layouts')

// Declare Express app
let app = express()

// Set view engine
app.set('view engine', 'ejs')

// Include (use) middle ware
app.use(layouts)

// Include routes from controllers

// Make a home route: GET /
app.get('/', (req, res) => {
	res.render('home')
})

// Listen from your port
app.listen(process.env.PORT || 3000)