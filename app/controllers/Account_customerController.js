const { models } = require('../models');

const findCustomerInAccount = (id) => {
    return models.account_customers.findOne({
        where: {
            customerid: id
        },
        raw: true
    })
}

const findCustomerInListcustomer = (id) => {
    return models.customers.findOne({
        where: {
            customerid: id
        },
        raw: true
    })
}

const findAccountBycustomerid = (id) => {
    return models.account_customers.findOne({
        where: {
            customerid: id
        },
        raw: true
    })
}

const listAccount = () => {
    return models.account_customers.findAll({ 
        raw: true,
        nest: true,
        include: [
            {model: models.customers, as: 'customer', attributes:['customerid', 'name','email', 'phone']}
        ],
    });
}

exports.list = async (req, res) => {
    const account_customers = await listAccount();
    res.render('account_customers/account_customer', { account_customers });
}

// [GET] /account_customer/create
exports.create = (req, res) => {
    res.render('account_customers/create-account_customer');
}

// [POST] /account_customer/store
exports.store = async (req, res, next) => {
    try {
        const customerInList = await findCustomerInListcustomer(req.body.customerid);
        if (customerInList) {
            const customer = await findCustomerInAccount(req.body.customerid);

            if (!customer) {
                models.account_customers.create(req.body)
                    .then(() => {
                        res.redirect('/account_customer');
                    })
                    .catch(next);
            }
            else {
                res.render('error', {
                    message: 'khách hàng này đã có tài khoản !!'
                })
            }
        }
        else {
            res.render('error', { message: 'Mã khách hàng không đúng! Vui lòng kiểm tra lại !!' })
        }
    }
    catch (error) {
        res.render('error', { message: 'Mã khách hàng không đúng! Vui lòng kiểm tra lại !!' })
    }
}

//[DELETE] /account_customer/:id
exports.delete = async (req, res, next) => {
    models.account_customers.destroy({
        where: { customerid: req.params.id }
    })
        .then(() => {
            res.redirect('back');
        })
        .catch(next);
}

//[GET] /account_customer/:id/edit
exports.edit = async (req, res) => {
    const account_customer = await findAccountBycustomerid(req.params.id);
    res.render('account_customers/edit-account_customer', { account_customer });
}

//[PUT] /order/:id
exports.update = async (req, res, next) => {
    models.account_customers.update(req.body, {where: { customerid: req.params.id}})
        .then(() => {
            res.redirect('/account_customer');
        })
        .catch(next);
}