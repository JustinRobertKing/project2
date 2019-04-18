module.exports = (req, res, next) => {
	if (req.user) {
		// Someone is logged in; this is expected; we allow them to proceed
		next()
	} else {
		req.flash('error', 'You must be logged in to view this page')
		res.redirect('/auth/login')
	}
}