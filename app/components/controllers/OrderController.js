const { models } = require('../../models');
const { Op } = require("sequelize");
const { getPagination } = require('../../../helpers/pagination');
const { getPagingData } = require('../../../helpers/pagination');
const orderService = require('../services/OrderService');


// [GET] /order
exports.list = async (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    let orders = await orderService.listOrder(term, limit, offset);

    for (let i = 0, j = orders.count; i < j; i++) {
        const orderProducts = await orderService.listOrderProduct(orders.rows[i].orderid, term);
        orders.rows[i].orderProducts = orderProducts;
    }
    const response  = getPagingData(orders, page, limit);

    res.render('orders/order', { 
        orders: response.tutorials, 
        totalPages: response.totalPages,  
        currentPage: response.currentPage,
        totalItems: response.totalItems,
    });
}

//[GET] /order/trash
exports.trash = async (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    let orders = await orderService.listOrderDeleted(term, limit, offset);

    for (let i = 0, j = orders.count; i < j; i++) {
        const orderProducts = await orderService.listOrderProductDeleted(orders.rows[i].orderid, term);
        orders.rows[i].orderProducts = orderProducts;
    }
    const response  = getPagingData(orders, page, limit);

    res.render('orders/trash-order', { 
        orders: response.tutorials, 
        totalPages: response.totalPages,  
        currentPage: response.currentPage,
        totalItems: response.totalItems,
    });
}

// [GET] /order/create
exports.create = (req, res) => {
    res.render('orders/create-order');
}

// [POST] /order/store
exports.store = async (req, res) => {
    const productnames = [].concat(req.body.productname);
    const amounts = [].concat(req.body.amount);
    const sizes = [].concat(req.body.size);
    const len = productnames.length;

    orderService.checkProductName(productnames).then(async (products) => {
        if (products.length == len) {
            let customer = await orderService.findCustomerByPhone(req.body.customerphone);

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
                    productid: products[i].productid,
                    amount: amounts[i],
                    size: parseInt(sizes[i]),
                });
            }

            let totalPrice = 0;
            for (let i = 0; i < len; i++) {
                //const product = await orderService.findProductById(products[i].productid);
                totalPrice += products[i].price * amounts[i];
            }
            await models.orders.update({ price: totalPrice.toFixed(2) }, { where: { orderid: newOrder.orderid } });
            if (req.body.print == 'true') {
                res.render('orders/invoice', await orderService.printOrder(newOrder.orderid));
            }
            else { res.redirect('/order') }
        }
        else { res.render('error', { message: `Tên sản phẩm chưa đúng! Vui lòng kiểm tra lại!` }) }
    })
    .catch(err => { res.render('error', { message: `Tên sản phẩm chưa đúng định dạng! Vui lòng kiểm tra lại!` }) });
}

//[DELETE] /order/:id
exports.delete = async (req, res, next) => {
    await models.order_products.destroy({ where: { orderid: req.params.id } });
    await models.orders.destroy({ where: { orderid: req.params.id } });
    res.redirect('back');
}

//[DELETE] /order/:id/force
exports.force = async (req, res) => {
    await models.order_products.destroy({ where: { orderid: req.params.id }, force: true });
    await models.orders.destroy({ where: { orderid: req.params.id }, force: true });
    res.redirect('back');
}

//[GET] /order/:id/edit
exports.edit = async (req, res) => {
    const order = await orderService.findOrderById(req.params.id);
    const customer = await orderService.findCustomerById(order.customerid);
    const orderProducts = await orderService.listOrderProduct(req.params.id);
    res.render('orders/edit-order', { order, customer, orderProducts });
}

//[PUT] /order/:id
exports.update = async (req, res) => {
    const amounts = [].concat(req.body.amount);
    const sizes = [].concat(req.body.size);
    const productids = [].concat(req.body.productid);
    const len = amounts.length;

    let customer = await orderService.findCustomerByPhone(req.body.customerphone);

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
        const product = await orderService.findProductById(productids[i]);
        totalPrice += product.price * amounts[i];
    }
    await models.orders.update({ price: totalPrice.toFixed(2) }, { where: { orderid: req.params.id } });
    res.redirect('/order');

}

//[PATCH] /order/:id/restore
exports.restore = async (req, res) => {
    await models.orders.restore({ where: { orderid: req.params.id } });
    await models.order_products.restore({ where: { orderid: req.params.id } });

    res.redirect('back');
}

//[GET] /order/:id/invoice
exports.invoice = async (req, res) => {
    res.render('orders/invoice', await orderService.printOrder(req.params.id))
}
