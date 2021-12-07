const { models } = require('../../models');
const { Op } = require("sequelize");
const { getPagination } = require('../../../helpers/pagination');
const { getPagingData } = require('../../../helpers/pagination');
const employeeService = require('../services/EmployeeService');

exports.list = (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    employeeService.listEmployee(term, limit, offset)
    .then((data) => {
        const response  = getPagingData(data, page, limit);
        res.render('employees/employee', { 
            employees: response.tutorials, 
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

// [GET] /employee/create
exports.create = (req, res) => {
    res.render('employees/create-employee');
}

// [POST] /employee/store
exports.store = async (req, res, next) => {
    models.employees.create(req.body)
        .then(async () => {
            const employee = await employeeService.findEmployeeByPhone(req.body.phone);

            const account = {
                username: employee.phone,
                email: employee.email,
                employeeid: employee.employeeid
            }
            models.account_employees.create(account)
                .then(() => { res.redirect('/employee') })
                .catch(() => {
                    res.render('error', {
                        message: 'Số điện thoại đã tồn tại trong danh sách!'
                    })
                });
        })
        .catch(next);
}

//[DELETE] /employee/:id
exports.delete = async (req, res, next) => {
    models.account_employees.destroy({
        where: { employeeid: req.params.id }
    })
        .then(() => {
            models.employees.destroy({
                where: { employeeid: req.params.id }
            })
                .then(() => res.redirect('back'))
                .catch(next);
        })
        .catch(next);
}


//[GET] /employee/trash
exports.trash = (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    employeeService.listEmployeeDeleted(term, limit, offset)
    .then((data) => {
        const response  = getPagingData(data, page, limit);
        res.render('employees/trash-employee', { 
            employees: response.tutorials, 
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

//[DELETE] /employee/:id/force
exports.force = (req, res, next) => {
    models.account_employees.destroy({
        where: { employeeid: req.params.id },
        force: true
    })
        .then(() => {
            models.employees.destroy({
                where: { employeeid: req.params.id },
                force: true
            })
                .then(() => res.redirect('back'))
                .catch(next);
        })
        .catch(next);
}

//[GET] /employee/:id/edit
exports.edit = async (req, res) => {
    const employee = await employeeService.findEmployeeById(req.params.id);
    res.render('employees/edit-employee', { employee });
}

//[PUT] /employee/:id
exports.update = (req, res, next) => {
    models.employees.update(req.body, {
        where: {
            employeeid: req.params.id
        }
    })
        .then(() => res.redirect('/employee'))
        .catch(next);
}

//[PATCH] /employee/:id/restore
exports.restore = (req, res, next) => {
    models.employees.restore({ where: { employeeid: req.params.id } })
        .then(() => res.redirect('back'))
        .catch(next);
}