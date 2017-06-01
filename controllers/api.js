const express = require('express');

module.exports = (authService, sudokuService, favoritesService, recordesService, cacheService,  config) => {
    const router = express.Router();
    const authController = require('./auth')(authService, config);
    const sudokuController = require('./sudoku')(sudokuService, config);
    const favoritesController = require('./favorites')(favoritesService, config);
    const recordesController = require('./record')(recordesService, config);

    router.use('/auth', authController);
    router.use('/sudoku', sudokuController);
    router.use('/favorites', favoritesController);
    router.use('/recordes', recordesController);

    return router;
};

function promiseHandler(res, promise) {
    promise
        .then(data => res.json(data))
        .catch(err => res.error(err));
}