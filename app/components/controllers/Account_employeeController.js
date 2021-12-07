const bcrypt = require('bcrypt');
const saltRounds = 10;
const { models } = require('../../models');
const accountEmployeeService = require('../services/Account_employeeService');
const { getPagination } = require('../../../helpers/pagination');
const { getPagingData } = require('../../../helpers/pagination');

exports.list = (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    accountEmployeeService.listAccount(term, limit, offset)
    .then((data) => {
        const response  = getPagingData(data, page, limit);
        res.render('account_employees/account_employee', { 
            account_employees: response.tutorials, 
            totalPages: response.totalPages,  
            currentPage: response.currentPage,
            totalItems: response.totalItems,
        });
        // res.send(response);
    })
    .catch(err => {
        res.render('error', {message: 'Có một vài lỗi xảy ra! Thử lại với thông tin khác!'})
    })
}

//[GET] /account_employee/trash
exports.trash = (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    accountEmployeeService.listAccountDeleted(term, limit, offset)
    .then((data) => {
        const response  = getPagingData(data, page, limit);
        res.render('account_employees/trash-account_employee', { 
            account_employees: response.tutorials, 
            totalPages: response.totalPages,  
            currentPage: response.currentPage,
            totalItems: response.totalItems,
        });
        // res.send(response);
    })
    .catch(err => {
        res.render('error', {message: 'Có một vài lỗi xảy ra! Thử lại với thông tin khác!'})
    })
}

// [GET] /account_employee/create
exports.create = (req, res) => {
    res.render('account_employees/create-account_employee', { wrongPassword: req.query.wrongPassword });
}

// [POST] /account_employee/store
exports.store = async (req, res, next) => {
    if (req.body.password !== req.body.confirmPassword) {
        res.redirect('/account_employee/create?wrongPassword');
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
        const accountEmployee = await accountEmployeeService.findAccountByEmployeeid(employee.employeeid);
        if(accountEmployee) {
            res.render('error', { message: 'Nhân viên này đã có tài khoản! Vui lòng kiểm tra lại !!' });
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
    await models.account_employees.create(account)
    res.redirect('/account_employee');
}

//[DELETE] /account_employee/:id
exports.delete = async (req, res, next) => {
    models.account_employees.destroy({
        where: { accountid: req.params.id }
    })
        .then(() => {
            res.redirect('back');
        })
        .catch(next);
}

//[DELETE] /account_employee/:id/force
exports.force = (req, res, next) => {
    models.account_employees.destroy({
        where: { accountid: req.params.id },
        force: true
    })
        .then(() => res.redirect('back'))
        .catch(next);
}

//[GET] /account_employee/:id/edit
exports.edit = async (req, res) => {
    const account_employee = await accountEmployeeService.findAccountByEmployeeid(req.params.id);
    res.render('account_employees/edit-account_employee', { account_employee });
}

//[PUT] /account_employee/:id
exports.update = async (req, res, next) => {
    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
    const account = {
        username: req.body.username,
        password: hashPassword,
    }

    models.account_employees.update(account, { where: { accountid: req.params.id } })
        .then(() => {
            res.redirect('/account_employee');
        })
        .catch(next);
}

//[PATCH] /account_employee/:id/restore
exports.restore = (req, res, next) => {
    models.account_employees.restore({
        where: { accountid: req.params.id },
    })
        .then(() => res.redirect('back'))
        .catch(next);
}