// Require needed modules
let express = require('express')

// Declare an express router
let router = express.Router()

// Reference the models
let db = require('../models')

// Declare routs
router.get('/', (req, res) => {
	res.send('Profile')
})

// Export the routes from this file
module.exports = router