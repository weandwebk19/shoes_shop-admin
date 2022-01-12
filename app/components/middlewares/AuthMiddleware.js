module.exports = function AuthMiddleware(req, res, next) {
    if (req.user == null) {
        res.redirect('/login');
  } else {
        next();
  }
}