const { models } = require('../../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.listFeedback = () => {
    return models.feedbacks.findAll({ raw: true });
}

exports.listFeedbackDeleted = () => {
    return models.feedbacks.findAll({ raw: true, paranoid: false});
}

exports.findFeedbackById = (id) => {
    return models.feedbacks.findOne({
        where: {
            feedbackid: id,
        },
        raw: true
    })
}