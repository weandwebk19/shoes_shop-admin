const { models } = require('../../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.listEmployee = (term, limit, offset, column, type) => {
    const condition = term? {[Op.or]: [ {name: {[Op.like]: `%${term}%`}}, 
    {gender: {[Op.like]: `%${term}%`}},
    {citizenid: {[Op.like]: `%${term}%`}},
    {phone: {[Op.like]: `%${term}%`}},
    {email: {[Op.like]: `%${term}%`}},]}:null ;

    const orderBy = column ? [[column, type]]: null;

    return models.employees.findAndCountAll({  
        raw: true, 
        where: condition,
        order: orderBy,
        limit, 
        offset, 
    });
}

exports.listEmployeeDeleted = (term, limit, offset, column, type) => {
    const condition = term? {[Op.or]: [ {name: {[Op.like]: `%${term}%`}}, 
    {gender: {[Op.like]: `%${term}%`}},
    {citizenid: {[Op.like]: `%${term}%`}},
    {phone: {[Op.like]: `%${term}%`}},
    {email: {[Op.like]: `%${term}%`}}], deletedAt:{[Op.ne]: null}}:{deletedAt:{[Op.ne]: null}} ;

    const orderBy = column ? [[column, type]]: null;
    
    return models.employees.findAndCountAll({ 
        raw: true, 
        where: condition,
        order: orderBy,
        limit, 
        offset,
        paranoid: false 
    });
}

exports.findEmployeeById = (id) => {
    return models.employees.findOne({
        where: {
            employeeid: id
        },
        raw: true
    })
}

exports.isExists = async (phone) => {
    const count = await models.employees.count({ where: { phone } });
    if(count > 0) {
        return true;
    }
    else return false;
}

exports.findEmployeeByPhone = (phone) => {
    return models.employees.findOne({
        where: {
            phone: phone
        },
        raw: true
    })
}