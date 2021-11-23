const { models } = require('../models');

const findCustomerById = (id) => {
    return models.customers.findOne({
        where: {
            customerid: id
        },
        raw: true
    })
}

const findCustomerByPhone = (phone) => {
    return models.customers.findOne({
        where: {
            phone: phone
        },
        raw: true
    })
}

const listCustomer = () => {
    return models.customers.findAll({ raw: true });
}

// [GET] /customer
exports.list = async (req, res) => {
    const customers = await listCustomer();
    res.render('customers/customer', { customers });
}

// [GET] /customer/create
exports.create = (req, res) => {
    res.render('customers/create-customer');
}

// [POST] /customer/store
exports.store = async (req, res, next) => {
    models.customers.create(req.body)
        .then(async() => {
            const customer = await findCustomerByPhone(req.body.phone);

            if (customer) {
                const account = {
                    username: customer.phone,
                    email: customer.email,
                    customerid: customer.customerid
                }
                models.account_customers.create(account)
                    .then(() => {res.redirect('/customer')})
                    .catch(next);
            }
            else {
                res.redirect('/customer')
            }
          })
        .catch(next);
}

//[DELETE] /customer/:id
exports.delete = async (req, res, next) => {
    models.account_customers.destroy({
        where: { customerid: req.params.id }
    })
        .then(() =>{
            models.customers.destroy({
                where: { customerid: req.params.id }
            })
                .then(() => res.redirect('back'))
                .catch(next);
        } )
        .catch(next);   
}

//[GET] /customer/:id/edit
exports.edit = async (req, res) => {
    const customer = await findCustomerById(req.params.id);
    res.render('customers/edit-customer', { customer });
}

//[PUT] /customer/:id
exports.update = (req, res, next) => {
    models.customers.update(req.body, {
        where: {
            customerid: req.params.id
        }
    })
        .then(() => res.redirect('/customer'))
        .catch(next);
}
