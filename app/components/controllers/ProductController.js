const { models } = require('../../models');
const { Op } = require("sequelize");
const { getPagination } = require('../../../helpers/pagination');
const { getPagingData } = require('../../../helpers/pagination');
const productService = require('../services/ProductServeice');

//[GET] /product
exports.list = (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    productService.listProduct(term, limit, offset)
    .then((data) => {
        const response  = getPagingData(data, page, limit);
        res.render('products/product', { 
            products: response.tutorials, 
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

// [GET] /product/create
exports.create = (req, res) => {
    res.render('products/create-product');
}

//[GET] /product/trash
exports.trash = (req, res) => {
    const { page, size, term } = req.query;
    const { limit, offset } = getPagination(page, size);

    productService.listProductDeleted(term, limit, offset)
    .then((data) => {
        const response  = getPagingData(data, page, limit);
        res.render('products/trash-product', { 
            products: response.tutorials, 
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

// [POST] /product/store
exports.store = (req, res, next) => {
    const reqBody = req.body;
    const productObject = {
        productname: reqBody.productname,
        price: reqBody.price,
        color: reqBody.color,
        status: reqBody.status,
        description: reqBody.description,
        image: [reqBody.image1, reqBody.image2, reqBody.image3]
    }
    models.products.create(productObject)
        .then(async () => {
            const currentProduct = await productService.findProductByReq(reqBody);
            const shoessizeObject = {
                productid: currentProduct.productid,
                size: reqBody.size,
                amount: reqBody.amount,
            }
            models.shoessize.create(shoessizeObject)
                .then(() => {
                    res.redirect('/product');
                })
                .catch(next);
        })
        .catch(next);
}

//[DELETE] /product/:id
exports.delete = (req, res, next) => {
    models.shoessize.destroy({
        where: { productid: req.params.id }
    })
        .then(() => {
            models.products.destroy({
                where: { productid: req.params.id }
            })
                .then(() => res.redirect('back'))
                .catch(next);
        })
        .catch(next);
}

//[DELETE] /product/:id/force
exports.force = (req, res, next) => {
    models.orders.destroy({
        where: { productid: req.params.id },
        force: true
    });

    models.shoessize.destroy({
        where: { productid: req.params.id },
        force: true
    })
        .then(() => {
            models.products.destroy({
                where: { productid: req.params.id },
                force: true
            })
                .then(() => res.redirect('back'))
                .catch(next);
        })
        .catch(next);
}

//[GET] /product/:id/edit
exports.edit = async (req, res) => {
    const product = await productService.findProductById(req.params.id);
    res.render('products/edit-product', {product});
}

//[PUT] /product/:id
exports.update = (req, res, next) => {
    models.products.update(req.body, {
        where: {
            productid: req.params.id
        }
    })
        .then(() => res.redirect('/product'))
        .catch(next);
}

//[PATCH] /product/:id/restore
exports.restore = (req, res, next) => {
    models.products.restore({where: { productid: req.params.id }})
        .then(() => res.redirect('back'))
        .catch(next);
}
