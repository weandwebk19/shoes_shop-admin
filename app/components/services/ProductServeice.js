const { models } = require('../../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.listProduct = (term, limit, offset, column, type) => {
    const condition = term? {[Op.or]: [ {productname: {[Op.like]: `%${term}%`}}, 
        {color: {[Op.like]: `%${term}%`}},
        {price:  parseFloat(term)?parseFloat(term):null},
        {description: {[Op.like]: `%${term}%`}}]}:null ;

    const orderBy = column ? [[column, type]]: null;

    return models.products.findAndCountAll({ 
        raw: true, 
        where: condition,
        order: orderBy,
        limit, 
        offset,
    });
}

exports.listProductDeleted = (term, limit, offset, column, type) => {
    const condition = term? {[Op.or]: [ {productname: {[Op.like]: `%${term}%`}}, 
    {color: {[Op.like]: `%${term}%`}},
    {price:  parseFloat(term)?parseFloat(term):null},
    {description: {[Op.like]: `%${term}%`}}],deletedAt:{[Op.ne]: null}}:{deletedAt:{[Op.ne]: null}} ;
    
    const orderBy = column ? [[column, type]]: null;
    
    return models.products.findAndCountAll({ 
        raw: true, 
        paranoid: false,
        where: condition,
        order: orderBy,
        limit, 
        offset,
    });
}

exports.findProductByReq = (reqBody) => {
    return models.products.findOne({
        where: {
            productname: reqBody.productname,
            price: reqBody.price,
            color: reqBody.color,
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
