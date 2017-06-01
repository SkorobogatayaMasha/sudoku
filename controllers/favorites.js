const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (favoritesService, config) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        jwt.verify(req.cookies[`x-access-token`], 'shhhhh', (err, data) => {
            console.log(data);

            res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');

            return favoritesService.findAll({where: {user_id: data.__user_id}})
                .then(favorites => res.send(favorites));
        })
    });




    router.post('/', (req, res) => {
        jwt.verify(req.cookies[`x-access-token`], 'shhhhh', (err, data) => {
            if (err)
                console.log(err);
            else {
                console.log(data);

                res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                res.header('Access-Control-Allow-Headers', 'Content-Type');

                return favoritesService.createOne({
                    user_id: data.__user_id,
                    sudoku_id: req.body.sudoku_id
                })
                    .then(favorite => res.send(favorite));
            }
        })
    });

    return router;
};