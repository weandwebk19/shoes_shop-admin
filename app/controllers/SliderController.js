const { models } = require('../models');

const listSlider = () => {
    return models.sliders.findAll({ raw: true });
}

const listSliderDeleted = () => {
    return models.sliders.findAll({ raw: true, paranoid: false});
}

const findSliderById = (id) => {
    return models.sliders.findOne({
        where: {
            sliderid: id,
        },
        raw: true
    })
}

//[GET] /slider
exports.list = async (req, res) => {
    const sliders = await listSlider();
    res.render('sliders/slider', { sliders });
}

// [GET] /slider/create
exports.create = (req, res) => {
    res.render('sliders/create-slider');
}

// [POST] /slider/store
exports.store = async (req, res, next) => {
    await models.sliders.create(req.body);
    res.redirect('/slider');
}

//[GET] /slider/trash
exports.trash = async (req, res) => {
    const sliders = await listSliderDeleted();
    res.render('sliders/trash-slider', { sliders});
}

//[DELETE] /slider/:id
exports.delete = async (req, res, next) => {
    await models.sliders.destroy({where: { sliderid: req.params.id }});
    res.redirect('back');
}

//[DELETE] /slider/:id/force
exports.force = async (req, res, next) => {
    await models.sliders.destroy({where: { sliderid: req.params.id }, force: true});
    res.redirect('back');
}

//[GET] /slider/:id/edit
exports.edit = async (req, res) => {
    const slider = await findSliderById(req.params.id);
    res.render('sliders/edit-slider', {slider});
}


//[PUT] /slider/:id
exports.update = (req, res, next) => {
    models.sliders.update(req.body, {
        where: {
            sliderid: req.params.id
        }
    })
        .then(() => res.redirect('/slider'))
        .catch(next);
}

//[PATCH] /slider/:id/restore
exports.restore = (req, res, next) => {
    models.sliders.restore({where: { sliderid: req.params.id }})
        .then(() => res.redirect('back'))
        .catch(next);
}
