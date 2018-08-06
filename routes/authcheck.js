

module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('errorMessages', "You must sign in to view this page");
        return res.redirect('/login');
    }
    next();
}
