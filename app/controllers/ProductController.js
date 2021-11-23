const { models } = require('../models');

const listProduct = () => {
    return models.products.findAll({ raw: true });
}

const listShoesSize = () => {
    return models.shoessize.findAll({ 
        //raw: true,
        attributes: [
            'productid', 'size', 'amount',
        ],
        include: [
            {model: models.products, as: 'product', attributes:['productname', 'price','color']},
        ],
     });
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

const findShoessizeByPK = (id, size) => {
    return models.shoessize.findOne({
        where: {
            productid: id,
            size: size,
        },
        raw: true
    })
}

//[GET] /product
exports.list = async (req, res) => {
    const products = await listProduct();
    const shoessize = await listShoesSize();
    res.render('products/product', { 
        products, 
        shoessize: JSON.parse(JSON.stringify(shoessize))
    });
}

// [GET] /product/create
exports.create = (req, res) => {
    res.render('products/create-product');
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

//[GET] /product/:id/edit
exports.edit = async (req, res) => {
    const product = await findProductById(req.params.id);
    //console.log(product)
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

// Shoessize Controller

//[DELETE] /product/shoessize/:id
exports.deleteShoessize = (req, res, next) => {
    models.shoessize.destroy({
        where: { productid: req.params.id, size: req.params.size}
    })
        .then(() => res.redirect('back'))
        .catch(next);
}

//[GET] /product/shoessize/:size/:id/edit
exports.editShoessize = async (req, res) => {
    const shoessize = await findShoessizeByPK(req.params.id, req.params.size);
    res.render('products/edit-shoessize', {shoessize});
}

//[PUT] /product/shoessize/:size/:id
exports.updateShoessize = (req, res, next) => {
    models.shoessize.update(req.body, {
        where: {
            productid: req.params.id, 
            size: req.params.size
        }
    })
        .then(() => res.redirect('/product'))
        .catch(next);
}