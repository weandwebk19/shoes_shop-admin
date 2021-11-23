const {models} = require('../models');

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

const findProductById = (id) => {
    return models.products.findOne({
        where: {
            productid: id,
        },
        raw: true
    })
}

const findOrderById = (id) => {
    return models.orders.findOne({
        where: {
            orderid: id,
        },
        raw: true
    })
}

const listOrder = () => {
    return models.orders.findAll({
        //raw: true,
        attributes: [
            'orderid', 'amount', 'price',
        ],
        include: [
            {model: models.products, as: 'product', attributes:['productname', 'price','color']},
            {model: models.customers, as: 'customer', attributes:['name', 'phone', 'address']},
        ],

    });
}

exports.list = async (req, res) => {
    const orders = await listOrder();
    res.render('orders/order', { orders: JSON.parse(JSON.stringify(orders))});
}

// [GET] /order/create
exports.create = (req, res) => {
    res.render('orders/create-order');
}

// [POST] /order/store
exports.store = async (req, res, next) => {
    let customer = await findCustomerByPhone(req.body.customerphone);
    const product = await findProductById(req.body.productid);
    if(product) {
        let order = {
            productid: product.productid,
            amount: req.body.amount,
            price: product.price * req.body.amount,
            customerid: null,
        };
    
        const createOrder = (order) => {
            models.orders.create(order)
                .then(() => res.redirect('/order'))
                .catch(next);
        }
    
        if( customer) {
            order.customerid = customer.customerid;
            createOrder(order);
        }
        else {
            customer = {
                name: req.body.customername,
                phone: req.body.customerphone,
                email: req.body.customeremail,
                address: req.body.customeraddress,
            }
            models.customers.create(customer)
                .then(async () => {
                    customer = await findCustomerByPhone(req.body.customerphone);
                    order.customerid = customer.customerid;
                    createOrder(order);
                })
                .catch(next);
        }
    }
    else {
        res.render('error', {
            message: 'Mã sản phẩm chưa đúng! Vui lòng kiểm tra lại!'
        })
    }    
}

//[DELETE] /order/:id
exports.delete = async (req, res, next) => {
    models.orders.destroy({
        where: { orderid: req.params.id }
    })
        .then(() =>{
            res.redirect('back');
        } )
        .catch(next);   
}

//[GET] /order/:id/edit
exports.edit = async (req, res) => {
    const order = await findOrderById(req.params.id);
    const customer = await findCustomerById(order.customerid);
    res.render('orders/edit-order', { order, customer });
}

//[PUT] /order/:id
exports.update = async (req, res, next) => {
    let customer = await findCustomerByPhone(req.body.customerphone);
    const product = await findProductById(req.body.productid);
    if(product) {
        let order = {
            productid: req.body.productid,
            amount: req.body.amount,
            price: product.price * req.body.amount,
            customerid: null,
        };
    
        const updateOrder = (order) => {
            models.orders.update(order, {where: {orderid: req.params.id}})
                .then(() => res.redirect('/order'))
                .catch(next);
        }
    
        if( customer) {
            order.customerid = customer.customerid;
            updateOrder(order);
        }
        else {
            customer = {
                name: req.body.customername,
                phone: req.body.customerphone,
                email: req.body.customeremail,
                address: req.body.customeraddress,
            }
            models.customers.create(customer)
                .then(async () => {
                    customer = await findCustomerByPhone(req.body.customerphone);
                    order.customerid = customer.customerid;
                    updateOrder(order);
                })
                .catch(next);
        }
    }
    else {
        res.render('error', {
            message: 'Mã sản phẩm chưa đúng! Vui lòng kiểm tra lại!'
        })
    }           
}