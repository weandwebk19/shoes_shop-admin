const { models } = require('../../models');
const { Op } = require("sequelize");
const { getPagination } = require('../../../helpers/pagination');
const { getPagingData } = require('../../../helpers/pagination');
const customerService = require('../services/CustomerService');

// [GET] /customer
exports.list = async (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await customerService.listCustomer(term, limit, offset);

    const response = getPagingData(data, page, limit);
    res.render('customers/customer', {
        customers: response.tutorials,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalItems: response.totalItems,
    });
}

// [GET] /customer/create
exports.create = (req, res) => {
    res.render('customers/create-customer');
}

//[GET] /customer/trash
exports.trash = async (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await customerService.listCustomerDeleted(term, limit, offset);

    const response = getPagingData(data, page, limit);
    res.render('customers/trash-customer', {
        customers: response.tutorials,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalItems: response.totalItems,
    });
}

// [POST] /customer/store
exports.store = async (req, res, next) => {
    let customer = await customerService.findCustomerByPhone(req.body.phone);
    if (!customer) {
        customer = await models.customers.create(req.body);
        const account = {
            username: customer.phone,
            email: customer.email,
            customerid: customer.customerid
        }
        await models.account_customers.create(account);
        res.redirect('/customer');
    }
    else {
        res.render('error', { message: 'Số điện thoại này đã tồn tại! Thử lại với thông tin khác!' })
    }
}

//[DELETE] /customer/:id
exports.delete = async (req, res, next) => {
    await models.account_customers.destroy({ where: { customerid: req.params.id } })
    await models.customers.destroy({ where: { customerid: req.params.id } })
    res.redirect('back');

}

//[DELETE] /customer/:id/force
exports.force = async (req, res, next) => {
    await models.account_customers.destroy({ where: { customerid: req.params.id }, force: true })
    await models.orders.destroy({ where: { customerid: req.params.id }, force: true })
    await models.customers.destroy({ where: { customerid: req.params.id }, force: true })
    res.redirect('back');
}

//[GET] /customer/:id/edit
exports.edit = async (req, res) => {
    const customer = await customerService.findCustomerById(req.params.id);
    res.render('customers/edit-customer', { customer });
}

//[PUT] /customer/:id
exports.update = async (req, res) => {
    await models.customers.update(req.body, { where: { customerid: req.params.id } })
    res.redirect('/customer');
}

//[PATCH] /customer/:id/restore
exports.restore = async (req, res) => {
    await models.customers.restore({ where: { customerid: req.params.id } })
    res.redirect('back');
}