const { models } = require('../../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.listAccount = (term, limit, offset) => {
    const condition = term? {[Op.or]: [ {username: {[Op.like]: `%${term}%`}}, 
    {'$employee.name$': {[Op.like]: `%${term}%`}},
    {'$employee.email':  {[Op.like]: `%${term}%`}},
    {'$employee.phone$': {[Op.like]: `%${term}%`}}]}:null ;
    
    return models.account_employees.findAndCountAll({
        raw: true,
        nest: true,
        include: [
            { model: models.employees, as: 'employee', attributes: ['employeeid', 'name', 'email', 'phone'] }
        ],
        where: condition,
        limit, 
        offset,
    });
}


exports.listAccountDeleted = (term, limit, offset) => {
    const condition = term? {[Op.or]: [ {username: {[Op.like]: `%${term}%`}}, 
    {'$employee.name$': {[Op.like]: `%${term}%`}},
    {'$employee.email':  {[Op.like]: `%${term}%`}},
    {'$employee.phone$': {[Op.like]: `%${term}%`}}], deletedAt:{[Op.ne]: null}}:{deletedAt:{[Op.ne]: null}} ;
    
    return models.account_employees.findAndCountAll({
        raw: true,
        nest: true,
        paranoid: false,
        include: [
            { model: models.employees, as: 'employee', attributes: ['employeeid', 'name', 'email', 'phone'], paranoid: false }
        ],
        where: condition,
        limit, 
        offset,
    });
}

exports.findEmployeeByPhone = (phone) => {
    return models.employees.findOne({
        where: {
            phone
        },
        raw: true
    })
}

exports.findAccountByEmployeeid = (id) => {
    return models.account_employees.findOne({
        where: {
            accountid: id
        },
        raw: true
    })
}