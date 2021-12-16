const { models } = require('../../models');
const { Op } = require("sequelize");
const { getPagination } = require('../../../helpers/pagination');
const { getPagingData } = require('../../../helpers/pagination');
const employeeService = require('../services/EmployeeService');

exports.list = async (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await employeeService.listEmployee(term, limit, offset);

    const response = getPagingData(data, page, limit);
    res.render('employees/employee', {
        employees: response.tutorials,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalItems: response.totalItems,
    });
}

// [GET] /employee/create
exports.create = (req, res) => {
    res.render('employees/create-employee');
}

// [POST] /employee/store
exports.store = async (req, res) => {
    if (await employeeService.isExists(req.body.phone)) {
        res.render('employees/create-employee', { message: "Số điện thoại là của một nhân viên khác! Vui lòng nhập lại!" });
        return;
    }

    const employee = await models.employees.create(req.body);

    await models.account_employees.create({
        username: employee.phone,
        email: employee.email,
        employeeid: employee.employeeid
    });
    res.redirect('/employee');
}

//[DELETE] /employee/:id
exports.delete = async (req, res) => {
    await models.account_employees.destroy({
        where: { employeeid: req.params.id }
    })

    await models.employees.destroy({
        where: { employeeid: req.params.id }
    })
    res.redirect('back');


}

//[GET] /employee/trash
exports.trash = async (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await employeeService.listEmployeeDeleted(term, limit, offset);

    const response = getPagingData(data, page, limit);
    res.render('employees/trash-employee', {
        employees: response.tutorials,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalItems: response.totalItems,
    });
}

//[DELETE] /employee/:id/force
exports.force = async (req, res) => {
    await models.account_employees.destroy({
        where: { employeeid: req.params.id },
        force: true
    })

    await models.employees.destroy({
        where: { employeeid: req.params.id },
        force: true
    })
    res.redirect('back');

}

//[GET] /employee/:id/edit
exports.edit = async (req, res) => {
    const employee = await employeeService.findEmployeeById(req.params.id);
    res.render('employees/edit-employee', { employee });
}

//[PUT] /employee/:id
exports.update = async (req, res) => {
    await models.employees.update(req.body, {
        where: {
            employeeid: req.params.id
        }
    })
    res.redirect('/employee');
}

//[PATCH] /employee/:id/restore
exports.restore = async (req, res) => {
    await models.employees.restore({ where: { employeeid: req.params.id } })
    res.redirect('back');
}