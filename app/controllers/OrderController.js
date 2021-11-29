const { models } = require('../models');

function findCustomerById(id) {
    return models.customers.findOne({
        where: {
            customerid: id
        },
        raw: true
    })
}

function findCustomerByPhone(phone) {
    return models.customers.findOne({
        where: {
            phone: phone
        },
        raw: true
    })
}

function findProductById(id) {
    return models.products.findOne({
        where: {
            productid: id,
        },
        raw: true
    })
}

function findOrderById(id) {
    return models.orders.findOne({
        where: {
            orderid: id,
        },
        raw: true
    })
}

function listOrder() {
    return models.orders.findAll({
        raw: true,
        nest: true,
        include: [
            { model: models.customers, as: 'customer', attributes: ['name', 'phone', 'address'] },
        ],
    });
}

function listOrderDeleted() {
    return models.orders.findAll({
        raw: true,
        nest: true,
        include: [
            { model: models.customers, as: 'customer', attributes: ['name', 'phone', 'address'] },
        ],
        paranoid: false,
    });
}

function listOrderProduct(orderid) {
    return models.order_products.findAll({
        raw: true,
        nest: true,
        include: [
            { model: models.products, as: 'product', attributes: ['productname', 'price', 'color'] },
        ],
        where: { orderid }
    })
}

function listOrderProductDeleted(orderid) {
    return models.order_products.findAll({
        raw: true,
        nest: true,
        include: [
            { model: models.products, as: 'product', attributes: ['productname', 'price', 'color'] },
        ],
        paranoid: false,
        where: { orderid }
    })
}

async function checkProductId(productids) {
    for (const id of productids) {
        const count = await models.products.count({ where: { productid: id } });
        if (count == 0) { return false }
    }
    return true;
}

async function printOrder(orderid) {
    const order = await findOrderById(orderid);
    const customer = await findCustomerById(order.customerid);
    const orderProducts = await listOrderProduct(order.orderid);
    return { order, customer, orderProducts };
}

// [GET] /order
exports.list = async (req, res) => {
    let orders = await listOrder();
    for (let order of orders) {
        const orderProducts = await listOrderProduct(order.orderid);
        order.orderProducts = orderProducts;
    }
    res.render('orders/order', { orders });
}

// [GET] /order/create
exports.create = (req, res) => {
    res.render('orders/create-order');
}

// [POST] /order/store
exports.store = async (req, res) => {
    const productids = [].concat(req.body.productid);
    const amounts = [].concat(req.body.amount);
    const sizes = [].concat(req.body.size);
    const len = productids.length;

    checkProductId(productids).then(async (isExists) => {
        if (isExists) {
            let customer = await findCustomerByPhone(req.body.customerphone);

            if (!customer) {
                customer = await models.customers.create({
                    name: req.body.customername,
                    phone: req.body.customerphone,
                    email: req.body.customeremail,
                    address: req.body.customeraddress,
                });
            }
            else { 
                customer = await models.customers.update({
                    name: req.body.customername,
                    phone: req.body.customerphone,
                    email: req.body.customeremail,
                    address: req.body.customeraddress,
                }, { where: { customerid: customer.customerid }});
            }
            var newOrder = await models.orders.create({ customerid: customer.customerid });

            for (let i = 0; i < len; i++) {
                await models.order_products.create({
                    orderid: newOrder.orderid,
                    productid: productids[i],
                    amount: amounts[i],
                    size: parseInt(sizes[i]),
                });
            }

            let totalPrice = 0;
            for (let i = 0; i < len; i++) {
                const product = await findProductById(productids[i]);
                totalPrice += product.price * amounts[i];
            }
            await models.orders.update({ price: totalPrice.toFixed(2) }, { where: { orderid: newOrder.orderid } });
            if (req.body.print == 'true') {
                res.render('orders/invoice', await printOrder(newOrder.orderid));
            }
            else { res.redirect('/order') }
        }
        else { res.render('error', { message: `Mã sản phẩm chưa đúng! Vui lòng kiểm tra lại!` }) }
    })
        .catch(err => { res.render('error', { message: `Mã sản phẩm chưa đúng định dạng! Vui lòng kiểm tra lại!` }) });
}

//[DELETE] /order/:id
exports.delete = async (req, res, next) => {
    await models.order_products.destroy({ where: { orderid: req.params.id } });
    await models.orders.destroy({ where: { orderid: req.params.id } });
    res.redirect('back');
}

//[GET] /order/trash
exports.trash = async (req, res) => {
    let orders = await listOrderDeleted();
    for (let order of orders) {
        const orderProducts = await listOrderProductDeleted(order.orderid);
        order.orderProducts = orderProducts;
    }
    res.render('orders/trash-order', { orders });
}

//[DELETE] /order/:id/force
exports.force = async (req, res, next) => {
    await models.order_products.destroy({ where: { orderid: req.params.id }, force: true });
    await models.orders.destroy({ where: { orderid: req.params.id }, force: true });
    res.redirect('back');
}

//[GET] /order/:id/edit
exports.edit = async (req, res) => {
    const order = await findOrderById(req.params.id);
    const customer = await findCustomerById(order.customerid);
    const orderProducts = await listOrderProduct(req.params.id);
    res.render('orders/edit-order', { order, customer, orderProducts });
}

//[PUT] /order/:id
exports.update = async (req, res) => {
    const amounts = [].concat(req.body.amount);
    const sizes = [].concat(req.body.size);
    const productids = [].concat(req.body.productid);
    const len = amounts.length;

    let customer = await findCustomerByPhone(req.body.customerphone);

    if (!customer) {
        customer = await models.customers.create({
            name: req.body.customername,
            phone: req.body.customerphone,
            email: req.body.customeremail,
            address: req.body.customeraddress,
        });
    }
    else { 
        customer = await models.customers.update({
            name: req.body.customername,
            phone: req.body.customerphone,
            email: req.body.customeremail,
            address: req.body.customeraddress,
        }, { where: { customerid: customer.customerid }});
    }
    await models.orders.update(
        { customerid: customer.customerid },
        {
            where: { orderid: req.params.id }
        });

    for (let i = 0; i < len; i++) {
        await models.order_products.update({
            //productid: productids[i],
            amount: amounts[i],
            size: parseInt(sizes[i]),
        }, {
            where: { orderid: req.params.id, 
                productid: productids[i]
            }
        });
    }

    let totalPrice = 0;
    for (let i = 0; i < len; i++) {
        const product = await findProductById(productids[i]);
        totalPrice += product.price * amounts[i];
    }
    await models.orders.update({ price: totalPrice.toFixed(2) }, { where: { orderid: req.params.id } });
    res.redirect('/order');

}

//[PATCH] /order/:id/restore
exports.restore = async (req, res, next) => {
    await models.orders.restore({ where: { orderid: req.params.id } });
    await models.order_products.restore({ where: { orderid: req.params.id } });

    res.redirect('back');
}

//[GET] /order/:id/invoice
exports.invoice = async (req, res) => {
    res.render('orders/invoice', await printOrder(req.params.id))
}
