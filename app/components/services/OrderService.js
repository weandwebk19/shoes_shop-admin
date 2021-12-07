const { models } = require('../../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.listOrder = (term, limit, offset)  =>{
    const condition = term? {[Op.or]: [ {price: parseFloat(term)?parseFloat(term):null}, 
        {'$customer.name$': {[Op.like]: `%${term}%`}},
        {'$customer.phone$': {[Op.like]: `%${term}%`}}]}:null ;

    return models.orders.findAndCountAll({
        raw: true,
        nest: true,
        include: [
            { model: models.customers, as: 'customer', attributes: ['name', 'phone', 'address'] },
        ],
        where: condition,
        limit, 
        offset, 
    });
}

exports.listOrderDeleted = (term, limit, offset)  =>{
    const condition = term? {[Op.or]: [ {price: parseFloat(term)?parseFloat(term):null}, 
        {'$customer.name$': {[Op.like]: `%${term}%`}},
        {'$customer.phone$': {[Op.like]: `%${term}%`}},], 
        deletedAt:{[Op.ne]: null}}: {deletedAt:{[Op.ne]: null}} ;

    return models.orders.findAndCountAll({
        raw: true,
        nest: true,
        include: [
            { model: models.customers, as: 'customer', attributes: ['name', 'phone', 'address'] },
        ],
        paranoid: false,
        where: condition,
        limit, 
        offset,
    });
}

exports.listOrderProduct = (orderid,term) => {
    const condition = term? {[Op.or]: [ {'$product.price$': parseFloat(term)?parseFloat(term):null}, 
        {'$product.color$': {[Op.like]: `%${term}%`}},
        {'$product.productname$': {[Op.like]: `%${term}%`}}], orderid }:{ orderid } ;

    return models.order_products.findAll({
        raw: true,
        nest: true,
        include: [
            { model: models.products, as: 'product', attributes: ['productname', 'price', 'color'] },
        ],
        where: condition,
    })
}

exports.listOrderProductDeleted = (orderid, term) => {
    const condition = term? {[Op.or]: [ {'$product.price$': parseFloat(term)?parseFloat(term):null}, 
    {'$product.color$': {[Op.like]: `%${term}%`}},
    {'$product.productname$': {[Op.like]: `%${term}%`}}], orderid, deletedAt:{[Op.ne]: null}}
    :{ orderid,  deletedAt:{[Op.ne]: null}} ;

    return models.order_products.findAll({
        raw: true,
        nest: true,
        include: [
            { model: models.products, as: 'product', attributes: ['productname', 'price', 'color'] },
        ],
        paranoid: false,
        where: condition,
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