module.exports = (req, res, next) => {
	if (req.user && req.user.admin) {
		// Someone is logged in; they are an admin; we allow them to proceed
		next()
	} else {
		req.flash('error', 'You must be logged in to view this page')
		res.redirect('/auth/login')
	}
}