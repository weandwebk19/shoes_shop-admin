const bcrypt = require('bcrypt');
const saltRounds = 10;
const { models } = require('../../models');
const accountEmployeeService = require('../services/Account_employeeService');
const { getPagination } = require('../../../helpers/pagination');
const { getPagingData } = require('../../../helpers/pagination');

exports.list = async (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await accountEmployeeService.listAccount(term, limit, offset);

    const response = getPagingData(data, page, limit);
    res.render('account_employees/account_employee', {
        account_employees: response.tutorials,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalItems: response.totalItems,
    });
}

//[GET] /account_employee/trash
exports.trash = async (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await accountEmployeeService.listAccountDeleted(term, limit, offset);

    const response = getPagingData(data, page, limit);
    res.render('account_employees/trash-account_employee', {
        account_employees: response.tutorials,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalItems: response.totalItems,
    });

}

// [GET] /account_employee/create
exports.create = (req, res) => {
    res.render('account_employees/create-account_employee');
}

// [POST] /account_employee/store
exports.store = async (req, res, next) => {
    if (req.body.password !== req.body.confirmPassword) {
        res.render('account_employees/create-account_employee', { message: "Mật khẩu không trùng khớp! Vui lòng nhập lại!" });
        return;
    }
    if (await accountEmployeeService.isDuplicateUsername(req.body.username)) {
        res.render('account_employees/create-account_employee', { message: "Username đã tồn tại! Vui lòng nhập một username khác!" });
        return;
    }
    
    let employee = await accountEmployeeService.findEmployeeByPhone(req.body.phone);

    if (!employee) {
        const infoEmp = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        }
        employee = await models.employees.create(infoEmp);
    }
    else {
        if (await accountEmployeeService.isHasAccount(employee.employeeid)) {
            res.render('account_employees/create-account_employee', { message: 'Nhân viên này đã có tài khoản! Vui lòng kiểm tra lại !!' });
            return;
        }
    }
    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
    const account = {
        employeeid: employee.employeeid,
        username: req.body.username,
        password: hashPassword,
        type: req.body.type,
    }
    await models.account_employees.create(account);
    res.redirect('/account_employee');
}

//[DELETE] /account_employee/:id
exports.delete = async (req, res, next) => {
    await models.account_employees.destroy({
        where: { accountid: req.params.id }
    })

    res.redirect('back');
}

//[DELETE] /account_employee/:id/force
exports.force = async (req, res, next) => {
    await models.account_employees.destroy({
        where: { accountid: req.params.id },
        force: true
    })
    res.redirect('back');
}

//[GET] /account_employee/:id/edit
exports.edit = async (req, res) => {
    const account_employee = await accountEmployeeService.findAccountById(req.params.id);
    res.render('account_employees/edit-account_employee', { account_employee });
}

//[PUT] /account_employee/:id
exports.update = async (req, res) => {
    await models.account_employees.update(req.body, { where: { accountid: req.params.id } });
    res.redirect('/account_employee');
}

//[PATCH] /account_employee/:id/restore
exports.restore = async (req, res) => {
    await models.account_employees.restore({
        where: { accountid: req.params.id },
    });
    res.redirect('back');
}