const { models } = require('../../models');
const { Op } = require("sequelize");
const { getPagination } = require('../../../helpers/pagination');
const { getPagingData } = require('../../../helpers/pagination');
const feedbackService = require('../services/FeedbackService');

//[GET] /feedback
exports.list = async (req, res) => {
    const feedbacks = await feedbackService.listFeedback();
    res.render('feedbacks/feedback', { feedbacks });
}

// [GET] /feedback/create
exports.create = (req, res) => {
    res.render('feedbacks/create-feedback');
}

// [POST] /feedback/store
exports.store = async (req, res, next) => {
    await models.feedbacks.create(req.body);
    res.redirect('/feedback');
}

//[GET] /feedback/trash
exports.trash = async (req, res) => {
    const feedbacks = await feedbackService.listFeedbackDeleted();
    res.render('feedbacks/trash-feedback', { feedbacks});
}

//[DELETE] /feedback/:id
exports.delete = async (req, res, next) => {
    await models.feedbacks.destroy({where: { feedbackid: req.params.id }});
    res.redirect('back');
}

//[DELETE] /feedback/:id/force
exports.force = async (req, res, next) => {
    await models.feedbacks.destroy({where: { feedbackid: req.params.id }, force: true});
    res.redirect('back');
}

//[GET] /feedback/:id/edit
exports.edit = async (req, res) => {
    const feedback = await feedbackService.findFeedbackById(req.params.id);
    res.render('feedbacks/edit-feedback', {feedback});
}


//[PUT] /feedback/:id
exports.update = (req, res, next) => {
    models.feedbacks.update(req.body, {
        where: {
            feedbackid: req.params.id
        }
    })
        .then(() => res.redirect('/feedback'))
        .catch(next);
}

//[PATCH] /feedback/:id/restore
exports.restore = (req, res, next) => {
    models.feedbacks.restore({where: { feedbackid: req.params.id }})
        .then(() => res.redirect('back'))
        .catch(next);
}
