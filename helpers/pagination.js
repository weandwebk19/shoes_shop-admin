module.exports = {
    getPagination: function (page, size) {
        const limit = size ? +size : 10;
        const offset = page ? page * limit : 0;

        return { limit, offset };
    },

    getPagingData: function (data, page, limit) {
        const { count: totalItems, rows: tutorials } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);

        return { totalItems, tutorials, totalPages, currentPage };
    }
}