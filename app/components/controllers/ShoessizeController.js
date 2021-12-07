const { models } = require('../../models');
const { Op } = require("sequelize");
const { getPagination } = require('../../../helpers/pagination');
const { getPagingData } = require('../../../helpers/pagination');
const shoessizeService = require('../services/ShoessizeServices');

//[GET] /shoessize
exports.list = (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    shoessizeService.listShoesSize(term, limit, offset)
        .then((data) => {
            const response  = getPagingData(data, page, limit);
            res.render('shoessizes/shoessize', { 
                shoessize: response.tutorials, 
                totalPages: response.totalPages,  
                currentPage: response.currentPage,
                totalItems: response.totalItems,
            });
            // res.send(response);
        })
        .catch(err => {
            res.render('error', {message: 'Có một vài lỗi xảy ra! Thử lại với thông tin khác!'})
        })
}

// [GET] /shoessize/create
exports.create = (req, res) => {
    res.render('shoessizes/create-shoessize');
}

//[GET] /shoessize/trash
exports.trash = (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    shoessizeService.listShoesSizeDeleted(term, limit, offset)
    .then((data) => {
        const response  = getPagingData(data, page, limit);
        res.render('shoessizes/trash-shoessize', { 
            shoessize: response.tutorials, 
            totalPages: response.totalPages,  
            currentPage: response.currentPage,
            totalItems: response.totalItems,
        });
        // res.send(response);
    })
    .catch(err => {
        res.render('error', {message: 'Có một vài lỗi xảy ra! Thử lại với thông tin khác!'})
    })
}

// [POST] /shoessize/store
exports.store = (req, res, next) => {
    models.shoessize.create(req.body)
        .then(() => {
            res.redirect('/shoessize');
        })
        .catch(next);
}

//[DELETE] /shoessize/:size/:id
exports.delete = (req, res, next) => {
    models.shoessize.destroy({
        where: { productid: req.params.id, size: req.params.size }
    })
        .then(() => res.redirect('back'))
        .catch(next);
}

//[DELETE] /shoessize/:size/:id/force
exports.force = (req, res, next) => {
    models.shoessize.destroy({
        where: { productid: req.params.id, size: req.params.size },
        force: true
    })
        .then(() => res.redirect('back'))
        .catch(next);
}

//[GET] /shoessize/:size/:id/edit
exports.edit = async (req, res) => {
    shoessizeService.findShoessizeByPK(req.params.id, req.params.size)
    .then((shoessize) => {
        res.render('shoessizes/edit-shoessize', { shoessize });
    })
    .catch(next);
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
    models.shoessize.restore({
        where: {
            productid: req.params.id,
            size: req.params.size
        }
    })
        .then(() => res.redirect('back'))
        .catch(next);
}