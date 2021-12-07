const { models } = require('../../models');
const { Op } = require("sequelize");
const { getPagination } = require('../../../helpers/pagination');
const { getPagingData } = require('../../../helpers/pagination');
const profileService = require('../services/ProfileService');

//[GET] /profile
exports.show = async (req, res) => {
    const account = await profileService.account(req.user.accountid);
    const info = await profileService.info(req.user.employeeid);

    res.render('profile', {account, info});
}

//[PUT] /profile/info/:id
exports.updateInfo = async (req, res, next) => {
    await models.employees.update(req.body, { where: { employeeid: req.params.id } })
    res.redirect('/profile');
}

//[PUT] /profile/account/:id
exports.updateAccount = async (req, res, next) => {
    if(req.body.password) {
        await models.account_employees.update(req.body, { where: { accountid: req.params.id } })
    }
    else { 
        const account = { avatar: req.body.avatar, username: req.body.username, type: req.body.type}
        await models.account_employees.update(account, { where: { accountid: req.params.id } })
    }
    res.redirect('/profile');
}