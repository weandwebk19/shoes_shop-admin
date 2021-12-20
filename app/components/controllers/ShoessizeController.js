const { models } = require('../../models');
const { Op } = require("sequelize");
const { getPagination } = require('../../../helpers/pagination');
const { getPagingData } = require('../../../helpers/pagination');
const shoessizeService = require('../services/ShoessizeServices');

//[GET] /shoessize
exports.list = async (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await shoessizeService.listShoesSize(term, limit, offset);
    const response = getPagingData(data, page, limit);

    res.render('shoessizes/shoessize', {
        shoessize: response.tutorials,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalItems: response.totalItems,
    });
}

// [GET] /shoessize/create
exports.create = (req, res) => {
    res.render('shoessizes/create-shoessize');
}

//[GET] /shoessize/trash
exports.trash = async (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await shoessizeService.listShoesSizeDeleted(term, limit, offset);

    const response = getPagingData(data, page, limit);
    res.render('shoessizes/trash-shoessize', {
        shoessize: response.tutorials,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalItems: response.totalItems,
    });
}

// [POST] /shoessize/store
exports.store = async (req, res) => {
    await models.shoessize.create(req.body);
    res.redirect('/shoessize');
}

//[DELETE] /shoessize/:size/:id
exports.delete = async (req, res) => {
    await models.shoessize.destroy({
        where: { productid: req.params.id, size: req.params.size }
    })
    res.redirect('back');
}

//[DELETE] /shoessize/:size/:id/force
exports.force = async (req, res) => {
    await models.shoessize.destroy({
        where: { productid: req.params.id, size: req.params.size },
        force: true
    });
    res.redirect('back');
}

//[GET] /shoessize/:size/:id/edit
exports.edit = async (req, res) => {
    const shoessize = await shoessizeService.findShoessizeByPK(req.params.id, req.params.size);
    res.render('shoessizes/edit-shoessize', { shoessize });
}

//[PUT] /shoessize/:size/:id
exports.update = async (req, res) => {
    await models.shoessize.update(req.body, {
        where: {
            productid: req.params.id,
            size: req.params.size
        }
    })
    res.redirect('/shoessize');
}

//[PATCH] /shoessize/:size/:id/restore
exports.restore = async (req, res) => {
    await models.shoessize.restore({
        where: {
            productid: req.params.id,
            size: req.params.size
        }
    });
    res.redirect('back');
}