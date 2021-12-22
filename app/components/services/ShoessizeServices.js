const { models } = require('../../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.listShoesSize = (term, limit, offset, column, type) => {
    
    const condition = term? {[Op.or]: [ {size: parseInt(term)?parseInt(term):null}, 
        {amount: parseInt(term)?parseInt(term):null},
        {'$product.productname$': {[Op.like]: `%${term}%`}}],}:null ;

    const orderBy = column ? (
        models.shoessize.rawAttributes[column] ?
        [[column, type]]:
        [[{ model: models.products, as: 'product'}, column, type]]
    ) : null;

    return models.shoessize.findAndCountAll({
        raw: true,
        nest: true,
        include: [
            { model: models.products, as: 'product', attributes: ['productname']},
        ],
        where: condition,
        order: orderBy,
        limit, 
        offset,
    });
}

exports.listShoesSizeDeleted = (term, limit, offset, column, type) =>{
    const condition = term? {[Op.or]: [ {size: parseInt(term)?parseInt(term):null}, 
        {amount: parseFloat(term)?parseFloat(term):null},
        {'$product.productname$': {[Op.like]: `%${term}%`}}], deletedAt:{[Op.ne]: null}}:{deletedAt:{[Op.ne]: null}} ;
    
    const orderBy = column ? (
        models.shoessize.rawAttributes[column] ?
        [[column, type]]:
        [[{ model: models.products, as: 'product'}, column, type]]
    ) : null;

    return models.shoessize.findAndCountAll({
        raw: true,
        nest: true,
        paranoid: false,
        include: [
            { model: models.products, as: 'product', attributes: ['productname'], paranoid: false },
        ],
        where: condition,
        order: orderBy,
        limit, 
        offset,
    });
}

exports.findShoessizeByPK = (id, size) => {
    return models.shoessize.findOne({
        where: {
            productid: id,
            size: size,
        },
        raw: true
    })
}
