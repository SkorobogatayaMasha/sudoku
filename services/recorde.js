const Promise = require('bluebird');


module.exports = (recordeRepository, errors) => {
    return { createOne: createOne, findAll: findAll, isExisting: isExisting, rand: rand};

    function createOne(content) {
        return recordeRepository.create(content)
    }

    function findAll(content) {
        return recordeRepository.findAll(content)
    }
    function findOne(content) {
        return recordeRepository.findOne(content)
    }
    
    function isExisting(time) {
        return recordeRepository.findOne({where: {time: time}})
            .then(result => result ? true : false)
    }

    function rand() {
        return Math.floor(Math.random() * 100) % 2 === 0;
    }
};