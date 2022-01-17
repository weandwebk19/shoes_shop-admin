const { models } = require('../../models');
const { Op } = require("sequelize");
const { getPagination } = require('../../../helpers/pagination');
const { getPagingData } = require('../../../helpers/pagination');
const productService = require('../services/ProductServeice');

//[GET] /product
exports.list = async (req, res) => {
    const { page, size, term, column, type } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await productService.listProduct(term, limit, offset, column, type);
    const response = getPagingData(data, page, limit);
    res.render('products/product', {
        products: response.tutorials,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalItems: response.totalItems,
    });

}

// [GET] /product/create
exports.create = (req, res) => {
    res.render('products/create-product');
}

//[GET] /product/trash
exports.trash = async (req, res) => {
    const { page, size, term, column, type } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await productService.listProductDeleted(term, limit, offset, column, type);
    const response = getPagingData(data, page, limit);
    res.render('products/trash-product', {
        products: response.tutorials,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalItems: response.totalItems,
    });
}

// [POST] /product/store
exports.store = async (req, res) => {
    const product = await models.products.create({
        productname: req.body.productname,
        price: req.body.price,
        brand: req.body.brand,
        color: req.body.color,
        status: req.body.status,
        description: req.body.description,
        image: [].concat(req.body.image)
    });

    await models.shoessize.create({
        productid: product.productid,
        size: req.body.size,
        amount: req.body.amount,
    });
    res.redirect('/product');
}

//[DELETE] /product/:id
exports.delete = async (req, res) => {
    await models.shoessize.destroy({
        where: { productid: req.params.id }
    });

    await models.products.destroy({
        where: { productid: req.params.id }
    })
    res.redirect('back');
}

//[DELETE] /product/:id/force
exports.force = async (req, res) => {
    await models.order_products.destroy({
        where: { productid: req.params.id },
        force: true
    });

    await models.shoessize.destroy({
        where: { productid: req.params.id },
        force: true
    });
    await models.products.destroy({
        where: { productid: req.params.id },
        force: true
    })
    res.redirect('back');
}

//[GET] /product/:id/edit
exports.edit = async (req, res) => {
    const product = await productService.findProductById(req.params.id);
    res.render('products/edit-product', { product });
}

//[PUT] /product/:id
exports.update = async (req, res) => {
    req.body.image = [].concat(req.body.image);
    await models.products.update(req.body, {
        where: {
            productid: req.params.id
        }
    });
    res.redirect('/product');
}

//[PATCH] /product/:id/restore
exports.restore = async (req, res) => {
    await models.products.restore({ where: { productid: req.params.id } })
    res.redirect('back');
}
