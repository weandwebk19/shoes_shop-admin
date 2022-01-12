const { models } = require('../../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const AccountEmployeeService = require('../services/Account_employeeService');
const sendEmail = require("../../../utils/sendEmail");
require('dotenv').config();

//[GET] /password-reset
exports.forgotPassword = async (req, res) => {
    res.render('forgot-password', {layout: false});
}

//[GET] /password-reset/:id
exports.resetPassword = async (req, res) => {
    res.render('reset-password', {layout: false, accountid: req.params.id});
}

//[POST] /password-reset
exports.sendEmail = async (req, res) => {
    try {
        const employee = await AccountEmployeeService.findEmployeeByEmail(req.body.email);
        if(!employee) {
            return res.status(400).send("Email này không tồn tại! Vui lòng thử với email khác.");
        }
        const account = await AccountEmployeeService.findAccountByEmployee(employee.employeeid);
        if (!account)
        { 
            return res.status(400).send("Email này không tồn tại! Vui lòng thử với email khác.");
        }

        const link = `${process.env.BASE_URL}/password-reset/${account.accountid}`;
        await sendEmail(employee.email, "Password reset", link);

        res.json({message: 'Kiểm tra email của bạn để tìm liên kết để đặt lại mật khẩu của bạn. Nếu nó không xuất hiện trong vòng vài phút, hãy kiểm tra thư mục spam của bạn.'});
    } catch (error) {
        res.status(400).send("An error occured");
    }
}

//[PUT] /password-reset
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