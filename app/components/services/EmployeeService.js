const { models } = require('../../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.listEmployee = (term, limit, offset) => {
    const condition = term? {[Op.or]: [ {name: {[Op.like]: `%${term}%`}}, 
    {gender: {[Op.like]: `%${term}%`}},
    {citizenid: {[Op.like]: `%${term}%`}},
    {phone: {[Op.like]: `%${term}%`}},
    {email: {[Op.like]: `%${term}%`}},]}:null ;

    return models.employees.findAndCountAll({  
        raw: true, 
        where: condition,
        limit, 
        offset, 
    });
}

exports.listEmployeeDeleted = (term, limit, offset) => {
    const condition = term? {[Op.or]: [ {name: {[Op.like]: `%${term}%`}}, 
    {gender: {[Op.like]: `%${term}%`}},
    {citizenid: {[Op.like]: `%${term}%`}},
    {phone: {[Op.like]: `%${term}%`}},
    {email: {[Op.like]: `%${term}%`}}], deletedAt:{[Op.ne]: null}}:{deletedAt:{[Op.ne]: null}} ;
    
    return models.employees.findAndCountAll({ 
        raw: true, 
        where: condition,
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

exports.findEmployeeByPhone = (phone) => {
    return models.employees.findOne({
        where: {
            phone: phone
        },
        raw: true
    })
}