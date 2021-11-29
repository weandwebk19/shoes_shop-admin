const { models } = require('../models');

const listShoesSize = () => {
    return models.shoessize.findAll({ 
        raw: true,
        nest: true,
        include: [
            {model: models.products, as: 'product', attributes:['productname', 'price','color']},
        ],
     });
}

const listShoesSizeDeleted = () => {
    return models.shoessize.findAll({ 
        raw: true,
        nest: true,
        paranoid: false,
        include: [
            {model: models.products, as: 'product', attributes:['productname', 'price','color', 'deletedAt'], paranoid: false},
        ],
     });
}

const findShoessizeByPK = (id, size) => {
    return models.shoessize.findOne({
        where: {
            productid: id,
            size: size,
        },
        raw: true
    })
}

//[GET] /shoessize
exports.list = async (req, res) => {
    const shoessize = await listShoesSize();
    res.render('shoessizes/shoessize', { shoessize });
}

// [GET] /shoessize/create
exports.create = (req, res) => {
    res.render('shoessizes/create-shoessize');
}

//[GET] /shoessize/trash
exports.trash = async (req, res) => {
    const shoessize = await listShoesSizeDeleted();
    res.render('shoessizes/trash-shoessize', { shoessize });
}

// [POST] /shoessize/store
exports.store = (req, res, next) => {
    models.shoessize.create(req.body)
    .then(() =>{
        res.redirect('/shoessize');
    })
    .catch(next);
}

//[DELETE] /shoessize/:size/:id
exports.delete = (req, res, next) => {
    models.shoessize.destroy({
        where: { productid: req.params.id, size: req.params.size}
    })
        .then(() => res.redirect('back'))
        .catch(next);
}

//[DELETE] /shoessize/:size/:id/force
exports.force = (req, res, next) => {
    models.shoessize.destroy({
        where: { productid: req.params.id, size: req.params.size}, 
        force: true
    })
        .then(() => res.redirect('back'))
        .catch(next);
}

//[GET] /shoessize/:size/:id/edit
exports.edit = async (req, res) => {
    const shoessize = await findShoessizeByPK(req.params.id, req.params.size);
    res.render('shoessizes/edit-shoessize', {shoessize});
}

//[PUT] /shoessize/:size/:id
exports.update = (req, res, next) => {
    models.shoessize.update(req.body, {
        where: {
            productid: req.params.id, 
            size: req.params.size
        }
    })
        .then(() => res.redirect('/shoessize'))
        .catch(next);
}

//[PATCH] /shoessize/:size/:id/restore
exports.restore = (req, res, next) => {
    models.shoessize.restore({where: { 
        productid: req.params.id,
        size: req.params.size
     }})
        .then(() => res.redirect('back'))
        .catch(next);
}