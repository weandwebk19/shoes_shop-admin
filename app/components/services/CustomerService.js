const { models } = require('../../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


exports.listCustomer = (term, limit, offset, column, type) => {
    const condition = term? {[Op.or]: [ {name: {[Op.like]: `%${term}%`}}, 
    {phone: {[Op.like]: `%${term}%`}},
    {address: {[Op.like]: `%${term}%`}},
    {email: {[Op.like]: `%${term}%`}},]}:null ;

    const orderBy = column ? [[column, type]]: null;

    return models.customers.findAndCountAll({         
        raw: true, 
        where: condition,
        order: orderBy,
        limit, 
        offset,  
    });
}

exports.listCustomerDeleted = (term, limit, offset, column, type) => {
    const condition = term? {[Op.or]: [ {name: {[Op.like]: `%${term}%`}}, 
    {email: {[Op.like]: `%${term}%`}},
    {phone: {[Op.like]: `%${term}%`}},
    {address: {[Op.like]: `%${term}%`}}], deletedAt:{[Op.ne]: null}}:{deletedAt:{[Op.ne]: null}} ;
    
    const orderBy = column ? [[column, type]]: null;
    
    return models.customers.findAndCountAll({ 
        raw: true, 
        paranoid: false, 
        where: condition,
        order: orderBy,
        limit, 
        offset,
    });
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
