const { models } = require('../../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.account = (id) => {
    return models.account_employees.findOne({ 
        where: {
            accountid: id,
        },
        raw: true
    })
}

exports.info = (id) => {
    return models.employees.findOne({ 
        where: {
            employeeid: id,
        },
        raw: true
    })
}