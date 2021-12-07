const bcrypt = require('bcrypt');
const saltRounds = 10;
const { models } = require('../../models');
const accountCustomerService = require('../services/Account_customerService');
const { getPagination } = require('../../../helpers/pagination');
const { getPagingData } = require('../../../helpers/pagination');

exports.list = (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    accountCustomerService.listAccount(term, limit, offset)
    .then((data) => {
        const response  = getPagingData(data, page, limit);
        res.render('account_customers/account_customer', { 
            account_customers: response.tutorials, 
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

//[GET] /account_customer/trash
exports.trash = (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    accountCustomerService.listAccountDeleted(term, limit, offset)
    .then((data) => {
        const response  = getPagingData(data, page, limit);
        res.render('account_customers/trash-account_customer', { 
            account_customers: response.tutorials, 
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

// [GET] /account_customer/create
exports.create = (req, res) => {
    res.render('account_customers/create-account_customer', { wrongPassword: req.query.wrongPassword });
}

// [POST] /account_customer/store
exports.store = async (req, res, next) => {
    if (req.body.password !== req.body.confirmPassword) {
        res.redirect('/account_customer/create?wrongPassword');
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
        const accountcustomer = await accountCustomerService.findAccountBycustomerid(customer.customerid);
        if(accountcustomer) {
            res.render('error', { message: 'Khách hàng này đã có tài khoản! Vui lòng kiểm tra lại !!' });
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
exports.delete = async (req, res, next) => {
    models.account_customers.destroy({
        where: { accountid: req.params.id }
    })
        .then(() => {
            res.redirect('back');
        })
        .catch(next);
}

//[DELETE] /account_customer/:id/force
exports.force = (req, res, next) => {
    models.account_customers.destroy({
        where: { accountid: req.params.id },
        force: true
    })
        .then(() => res.redirect('back'))
        .catch(next);
}

//[GET] /account_customer/:id/edit
exports.edit = async (req, res) => {
    const account_customer = await accountCustomerService.findAccountBycustomerid(req.params.id);
    res.render('account_customers/edit-account_customer', { account_customer });
}

//[PUT] /account_customer/:id
exports.update = async (req, res, next) => {
    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
    const account = {
        username: req.body.username,
        password: hashPassword,
    }

    models.account_customers.update(account, { where: { accountid: req.params.id } })
        .then(() => {
            res.redirect('/account_customer');
        })
        .catch(next);
}

//[PATCH] /account_customer/:id/restore
exports.restore = (req, res, next) => {
    models.account_customers.restore({
        where: { accountid: req.params.id },
    })
        .then(() => res.redirect('back'))
        .catch(next);
}