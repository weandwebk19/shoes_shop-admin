const bcrypt = require('bcrypt');
const saltRounds = 10;
const { models } = require('../../models');
const accountCustomerService = require('../services/Account_customerService');
const { getPagination } = require('../../../helpers/pagination');
const { getPagingData } = require('../../../helpers/pagination');

exports.list = async (req, res) => {
    const { page, size, term, column, type } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await accountCustomerService.listAccount(term, limit, offset, column, type);

    const response = getPagingData(data, page, limit);
    res.render('account_customers/account_customer', {
        account_customers: response.tutorials,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalItems: response.totalItems,
    });

}

//[GET] /account_customer/trash
exports.trash = async (req, res) => {
    const { page, size, term, column, type } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await accountCustomerService.listAccountDeleted(term, limit, offset, column, type)

    const response = getPagingData(data, page, limit);
    res.render('account_customers/trash-account_customer', {
        account_customers: response.tutorials,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalItems: response.totalItems,
    });
}

// [GET] /account_customer/create
exports.create = (req, res) => {
    res.render('account_customers/create-account_customer');
}

// [POST] /account_customer/store
exports.store = async (req, res, next) => {
    if (req.body.password !== req.body.confirmPassword) {
        res.render('account_customers/create-account_customer', { message:  "Mật khẩu không trùng khớp! Vui lòng nhập lại!"});
        return;
    }
    if (await accountCustomerService.isDuplicateUsername(req.body.username)) {
        res.render('account_customers/create-account_customer', { message:  "Username đã tồn tại! Vui lòng nhập một username khác!"});
        return;
    }
    
    let customer = await accountCustomerService.findCustomerByPhone(req.body.phone);

    if (!customer) {
        const infoCus = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        }
        customer = await models.customers.create(infoCus);
    }
    else {
        if (await accountCustomerService.isHasAccount(customer.customerid)) {
            res.render('account_customers/create-account_customer', { message: 'Khách hàng này đã có tài khoản! Vui lòng kiểm tra lại !!' });
            return;
        }
    }
    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
    const account = {
        customerid: customer.customerid,
        username: req.body.username,
        password: hashPassword,
    }
    await models.account_customers.create(account)
    res.redirect('/account_customer');
}

//[DELETE] /account_customer/:id
exports.delete = async (req, res) => {
    await models.account_customers.destroy({
        where: { accountid: req.params.id }
    });

    res.redirect('back');
}

//[DELETE] /account_customer/:id/force
exports.force = async (req, res) => {
    await models.account_customers.destroy({
        where: { accountid: req.params.id },
        force: true
    });
    res.redirect('back');
}

//[GET] /account_customer/:id/edit
exports.edit = async (req, res) => {
    const account_customer = await accountCustomerService.findAccountById(req.params.id);
    res.render('account_customers/edit-account_customer', { account_customer });
}

//[PUT] /account_customer/:id
exports.update = async (req, res) => {
    await models.account_customers.update(req.body, { where: { accountid: req.params.id } });
    res.redirect('/account_customer');
}

//[PATCH] /account_customer/:id/restore
exports.restore = async (req, res) => {
    await models.account_customers.restore({
        where: { accountid: req.params.id },
    })
    res.redirect('back');
}