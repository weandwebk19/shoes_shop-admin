const { models } = require('../../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const profileService = require('../services/ProfileService');

//[GET] /profile
exports.show = async (req, res) => {
    const account = await profileService.account(req.user.accountid);
    const info = await profileService.info(req.user.employeeid);
    res.render('profiles/profile', { account, info });
}

//[GET] /profile/change-password
exports.changePassword = async (req, res) => {
    res.render('profiles/change-password');
}

//[PUT] /profile/password/:id
exports.updatePassword = async (req, res) => {
    if (req.body.newPassword !== req.body.confirmPassword) {
        res.render('profiles/change-password', { message: "Mật khẩu không trùng khớp! Vui lòng nhập lại!" });
        return;
    }
    else {
        const hashPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
        await models.account_employees.update({ password: hashPassword }, { where: { accountid: req.params.id } })
        res.redirect('/profile');
    }
}

//[PUT] /profile/info/:id
exports.updateInfo = async (req, res) => {
    await models.employees.update(req.body, { where: { employeeid: req.params.id } })
    res.redirect('/profile');
}

//[PUT] /profile/account/:id
exports.updateAccount = async (req, res) => {
    await models.account_employees.update(req.body, { where: { accountid: req.params.id } });
    res.redirect('/profile');
}