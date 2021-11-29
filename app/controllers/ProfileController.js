const { models } = require('../models');


//[GET] /profile
exports.show = (req, res) => {
    res.render('profile');
}