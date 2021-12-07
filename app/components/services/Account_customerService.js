const { models } = require('../../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.listAccount = (term, limit, offset) => {
    const condition = term? {[Op.or]: [{username: {[Op.like]: `%${term}%`}},
        {type: {[Op.like]: `%${term}%`}}, 
        {'$customer.name$': {[Op.like]: `%${term}%`}},
        {'$customer.phone$': {[Op.like]: `%${term}%`}},
        {'$customer.address$': {[Op.like]: `%${term}%`}},
        {'$customer.email$': {[Op.like]: `%${term}%`}},]}:null ;

    return models.account_customers.findAndCountAll({ 
        raw: true,
        nest: true,
        include: [
            {model: models.customers, as: 'customer', attributes:['customerid', 'name','email', 'phone', 'address']}
        ],
        where: condition,
        limit, 
        offset,
    });
}


exports.listAccountDeleted = (term, limit, offset) =>{
    const condition = term? {[Op.or]: [{username: {[Op.like]: `%${term}%`}},
    {type: {[Op.like]: `%${term}%`}}, 
    {'$customer.name$': {[Op.like]: `%${term}%`}},
    {'$customer.phone$': {[Op.like]: `%${term}%`}},
    {'$customer.address$': {[Op.like]: `%${term}%`}},
    {'$customer.email$': {[Op.like]: `%${term}%`}}], deletedAt:{[Op.ne]: null}}:{deletedAt:{[Op.ne]: null}} ;

    return models.account_customers.findAndCountAll({
        raw: true,
        nest: true,
        paranoid: false,
        include: [
            {model: models.customers, as: 'customer', attributes:['customerid', 'name','email', 'phone', 'address']}
        ],
        where: condition,
        limit, 
        offset,
    });
}

exports.findCustomerByPhone = (phone) => {
    return models.customers.findOne({
        where: {
            phone
        },
        raw: true
    })
}

exports.findAccountBycustomerid = (id) => {
    return models.account_customers.findOne({
        where: {
            accountid: id
        },
        raw: true
    })
}
