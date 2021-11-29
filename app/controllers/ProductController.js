const { models } = require('../models');

const listProduct = () => {
    return models.products.findAll({ raw: true });
}

const listProductDeleted = () => {
    return models.products.findAll({ raw: true, paranoid: false});
}

const findProductByReq = (reqBody) => {
    return models.products.findOne({
        where: {
            productname: reqBody.productname,
            price: reqBody.price,
            color: reqBody.color,
        },
        raw: true
    })
}

const findProductById = (id) => {
    return models.products.findOne({
        where: {
            productid: id,
        },
        raw: true
    })
}

//[GET] /product
exports.list = async (req, res) => {
    const products = await listProduct();
    res.render('products/product', { products });
}

// [GET] /product/create
exports.create = (req, res) => {
    res.render('products/create-product');
}

//[GET] /product/trash
exports.trash = async (req, res) => {
    const products = await listProductDeleted();
    res.render('products/trash-product', { products});
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
            const currentProduct = await findProductByReq(reqBody);
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
    const product = await findProductById(req.params.id);
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
