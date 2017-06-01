const Promise = require('bluebird');


module.exports = (favoritesRepository, errors) => {
    return { createOne: createOne, findAll: findAll};

    function createOne(content) {
        return favoritesRepository.create(content)
    }

    function findAll(content) {
        return favoritesRepository.findAll(content)
    }
};