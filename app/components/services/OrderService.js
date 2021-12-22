const { models } = require('../../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.listOrder = (term, limit, offset, column, type)  =>{
    const condition = term? {[Op.or]: [ {price: parseFloat(term)?parseFloat(term):null}, 
        {'$customer.name$': {[Op.like]: `%${term}%`}},
        {'$customer.phone$': {[Op.like]: `%${term}%`}}]}:null ;

    const orderBy = column ? (
        models.orders.rawAttributes[column] ?
        [[column, type]]:
        (models.customers.rawAttributes[column] ?
        [[{ model: models.customers, as: 'customer'}, column, type]]: 
        null)
    ) : null;

    return models.orders.findAndCountAll({
        raw: true,
        nest: true,
        include: [
            { model: models.customers, as: 'customer', attributes: ['name', 'phone', 'address'] },
        ],
        where: condition,
        order: orderBy,
        limit, 
        offset, 
    });
}

exports.listOrderDeleted = (term, limit, offset, column, type)  =>{
    const condition = term? {[Op.or]: [ {price: parseFloat(term)?parseFloat(term):null}, 
        {'$customer.name$': {[Op.like]: `%${term}%`}},
        {'$customer.phone$': {[Op.like]: `%${term}%`}},], 
        deletedAt:{[Op.ne]: null}}: {deletedAt:{[Op.ne]: null}} ;

    const orderBy = column ? (
        models.orders.rawAttributes[column] ?
        [[column, type]]:
        (models.customers.rawAttributes[column] ?
        [[{ model: models.customers, as: 'customer'}, column, type]]: 
        null)
    ) : null;

    return models.orders.findAndCountAll({
        raw: true,
        nest: true,
        include: [
            { model: models.customers, as: 'customer', attributes: ['name', 'phone', 'address'] },
        ],
        paranoid: false,
        where: condition,
        order: orderBy,
        limit, 
        offset,
    });
}

exports.listOrderProduct = (orderid,term, column, type) => {
    const condition = term? {[Op.or]: [ {'$product.price$': parseFloat(term)?parseFloat(term):null}, 
        {'$product.color$': {[Op.like]: `%${term}%`}},
        {'$product.productname$': {[Op.like]: `%${term}%`}}], orderid }:{ orderid } ;

    const orderBy = column ? (
        models.order_products.rawAttributes[column] ?
        [[column, type]]:
        (models.products.rawAttributes[column] ?
        [[{ model: models.products, as: 'product'}, column, type]]: 
        null)
    ) : null;

    return models.order_products.findAll({
        raw: true,
        nest: true,
        include: [
            { model: models.products, as: 'product', attributes: ['productname', 'price', 'color'] },
        ],
        where: condition,
        order: orderBy,
    })
}

exports.listOrderProductDeleted = (orderid, term, column, type) => {
    const condition = term? {[Op.or]: [ {'$product.price$': parseFloat(term)?parseFloat(term):null}, 
    {'$product.color$': {[Op.like]: `%${term}%`}},
    {'$product.productname$': {[Op.like]: `%${term}%`}}], orderid, deletedAt:{[Op.ne]: null}}
    :{ orderid,  deletedAt:{[Op.ne]: null}} ;

    const orderBy = column ? (
        models.order_products.rawAttributes[column] ?
        [[column, type]]:
        (models.products.rawAttributes[column] ?
        [[{ model: models.products, as: 'product'}, column, type]]: 
        null)
    ) : null;

    return models.order_products.findAll({
        raw: true,
        nest: true,
        include: [
            { model: models.products, as: 'product', attributes: ['productname', 'price', 'color'] },
        ],
        paranoid: false,
        where: condition,
        order: orderBy,
    })
}


exports.findCustomerById = (id) => {
    return models.customers.findOne({
        where: {
            customerid: id
        },
        raw: true
    })
}

exports.findCustomerByPhone = (phone) => {
    return models.customers.findOne({
        where: {
            phone: phone
        },
        raw: true
    })
}

exports.findProductById = (id) => {
    return models.products.findOne({
        where: {
            productid: id,
        },
        raw: true
    })
}

exports.findProductByName = (name) => {
    return models.products.findOne({
        where: {
            productname: {[Op.like]: `%${name}%`},
        },
        raw: true
    })
}

exports.findOrderById = (id) => {
    return models.orders.findOne({
        where: {
            orderid: id,
        },
        raw: true
    })
}

exports.checkProductId = async (productids) => {
    for (const id of productids) {
        const count = await models.products.count({ where: { productid: id } });
        if (count == 0) { return false }
    }
    return true;
}

exports.checkProductName = async (productnames) => {
    let results = [];
    for (const name of productnames) {
        const product = await models.products.findOne({ where: { productname: {[Op.like]: `%${name}%`} } });
        if(product){
            results.push(product);
        }
    }
    return results;
}

exports.printOrder = async (orderid) => {
    const order = await models.orders.findOne({ where: { orderid },raw: true });
    const customer = await models.customers.findOne({
        where: {
            customerid: order.customerid
        },
        raw: true
    });
    const orderProducts = await models.order_products.findAll({
        raw: true,
        nest: true,
        include: [
            { model: models.products, as: 'product', attributes: ['productname', 'price', 'color'] },
        ],
        where: {orderid: order.orderid},
    });

    return { order, customer, orderProducts };
}