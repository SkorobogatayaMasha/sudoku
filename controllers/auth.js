const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (authService, config) => {
    const router = express.Router();


    router.post('/login', (req, res) => {
        if(req.body.password.length<1){res.send("введите пароль");return 0;}
            authService.login(req.body)
                .then((userId) => {
                     const token = jwt.sign({ __user_id: userId }, 'shhhhh');
                     res.cookie('x-access-token', token);
                    res.redirect("/index.html");
                })
                .catch((err) => res.error(err));

    });

    router.get('/getId', (req, res) => {

        jwt.verify(req.cookies['x-access-token'], 'shhhhh', function (err, decoded) {
            res.send({id:decoded.__user_id});
        });


    });

    router.post('/register', (req, res) => {

        if ((/[0-9]+/).test(req.body.firstname) || req.body.firstname.length > 30) {
            res.end('Введите нормальное имя');
            return 0;
        }
        if ((/[0-9]+/).test(req.body.lastname) || req.body.lastname.length > 30) {
            res.end('Введите нормальную фамилию');
            return 0;
        }



        if(req.body.password.length<1){res.send("введите пароль");return 0;}
        authService.register(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.error(err));
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)) {
            res.send('Not valid email');
        }
        else {

            authService.register(req.body)
                .then(() => {
                    return authService.login(req.body)
                        .then(userId => {
                            const token = jwt.sign({__user_id: userId}, 'shhhhh');
                            res.cookie('x-access-token', token);
                            res.redirect("/index.html");
                        })
                })
                .catch(err => res.error(err));
        }
    });

    router.get('/logout', (req, res) => {
        //res.cookie(config.cookie.auth, '');
        res.redirect("/vhod.html")
    });

    return router;
};