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

//[PUT] /profile/change-password
exports.updatePassword = async (req, res) => {
    if (req.body.newPassword !== req.body.confirmPassword) {
        res.status(500).send("Mật khẩu không trùng khớp! Vui lòng nhập lại!");
    }
    else {
        const hashPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
        await models.account_employees.update({ password: hashPassword }, { where: { accountid: req.body.accountid } })
        res.json({message: 'Cập nhật thành công!!'});
    }
}

//[PUT] /profile/info
exports.updateInfo = async (req, res) => {
    try {
        await models.employees.update(req.body, { where: { employeeid: req.body.employeeid } })
        res.json({message: 'Cập nhật thành công!!'});
    }
    catch (err) {
       res.render('error', { message: "Cập nhật không thành công!"});
    }
}

//[PUT] /profile/account
exports.updateAccount = async (req, res) => {
    try {
        await models.account_employees.update(req.body, { where: { accountid: req.body.accountid } });
        res.json({message: 'Cập nhật thành công!!', account: req.body});
    }
    catch (err) {
       res.render('error', { message: "Cập nhật không thành công!"});
    }
}