const { models } = require('../../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.listAccount = (term, limit, offset, column, type) => {
    const condition = term? {[Op.or]: [ {username: {[Op.like]: `%${term}%`}}, 
    {'$employee.name$': {[Op.like]: `%${term}%`}},
    {'$employee.email$':  {[Op.like]: `%${term}%`}},
    {'$employee.phone$': {[Op.like]: `%${term}%`}}]}:null ;
    
    const orderBy = column ? (
        models.account_employees.rawAttributes[column] ?
        [[column, type]]:
        [[{ model: models.employees, as: 'employee'}, column, type]]
    ) : null;

    return models.account_employees.findAndCountAll({
        raw: true,
        nest: true,
        include: [
            { model: models.employees, as: 'employee', attributes: ['employeeid', 'name', 'email', 'phone'] }
        ],
        where: condition,
        order: orderBy,
        limit, 
        offset,
    });
}


exports.listAccountDeleted = (term, limit, offset, column, type) => {
    const condition = term? {[Op.or]: [ {username: {[Op.like]: `%${term}%`}}, 
    {'$employee.name$': {[Op.like]: `%${term}%`}},
    {'$employee.email$':  {[Op.like]: `%${term}%`}},
    {'$employee.phone$': {[Op.like]: `%${term}%`}}], deletedAt:{[Op.ne]: null}}:{deletedAt:{[Op.ne]: null}} ;

    const orderBy = column ? (
        models.account_employees.rawAttributes[column] ?
        [[column, type]]:
        [[{ model: models.employees, as: 'employee'}, column, type]]
    ) : null;
    
    return models.account_employees.findAndCountAll({
        raw: true,
        nest: true,
        paranoid: false,
        include: [
            { model: models.employees, as: 'employee', attributes: ['employeeid', 'name', 'email', 'phone'], paranoid: false }
        ],
        where: condition,
        order: orderBy,
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

exports.findEmployeeByEmail = (email) => {
    return models.employees.findOne({
        where: {
            email
        },
        raw: true
    })
}

exports.findAccountById = (id) => {
    return models.account_employees.findOne({
        where: { accountid: id },
        raw: true,
    });
}

exports.findAccountByEmployee = (id) => {
    return models.account_employees.findOne({
        where: { employeeid: id },
        raw: true,
    });
}

exports.isHasAccount = async (employeeid) => {
    const count = await models.account_employees.count({ where: { employeeid} });
    if(count > 0) {
        return true;
    }
    else return false;
}

exports.isDuplicateUsername= async (username) => {
    const count = await models.account_employees.count({ where: { username } });
    if(count > 0) {
        return true;
    }
    else return false;
}
