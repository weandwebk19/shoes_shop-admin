const { models } = require('../../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.listShoesSize = (term, limit, offset) => {
    const condition = term? {[Op.or]: [ {size: parseInt(term)?parseInt(term):null}, 
        {amount: parseFloat(term)?parseFloat(term):null},
        {'$product.productname$': {[Op.like]: `%${term}%`}}],}:null ;

    return models.shoessize.findAndCountAll({
        raw: true,
        nest: true,
        include: [
            { model: models.products, as: 'product', attributes: ['productname', 'price', 'color']},
        ],
        where: condition,
        limit, 
        offset,
    });
}

exports.listShoesSizeDeleted = (term, limit, offset) =>{
    const condition = term? {[Op.or]: [ {size: parseInt(term)?parseInt(term):null}, 
        {amount: parseFloat(term)?parseFloat(term):null},
        {'$product.productname$': {[Op.like]: `%${term}%`}}], deletedAt:{[Op.ne]: null}}:{deletedAt:{[Op.ne]: null}} ;

    return models.shoessize.findAndCountAll({
        raw: true,
        nest: true,
        paranoid: false,
        include: [
            { model: models.products, as: 'product', attributes: ['productname', 'price', 'color'], paranoid: false },
        ],
        where: condition,
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
