const jwt = require('jsonwebtoken');

module.exports = (sudokuService, cacheService, config, promiseHandler) => {
    const BaseController = require('./base');

    Object.setPrototypeOf(DomainController.prototype, BaseController.prototype);

    function DomainController(sudokuService, promiseHandler) {
        BaseController.call(this, sudokuService, promiseHandler);

        this.routes['/generate'] = [{ method: 'get', cb: generate }];
        this.routes['/'] = [{ method: 'get', cb: getSudoku }];
        this.routes['/getSudokus/:id'] = [{ method: 'get', cb: getSudokus }];
        this.routes['/getLast'] = [{ method: 'get', cb: getLastSudoku }];

        this.registerRoutes();

        return this.router;



        function getLike(req, res) {
            jwt.verify(req.cookies[`x-access-token`], 'shhhhh', (err, data) => {
                console.log(data);

                res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                res.header('Access-Control-Allow-Headers', 'Content-Type');

                return sudokuService.findAll({user_id: data.__user_id})
                    .then(sudokus => res.send(sudokus));
            })
        }



        function getLastSudoku(req, res) {

            res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');


               return sudokuService.findLast()
                   .then(sudokus => res.send(sudokus));

        }


        function getSudoku(req, res) {
            jwt.verify(req.cookies[`x-access-token`], 'shhhhh', (err, data) => {
                console.log(data);

                res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                res.header('Access-Control-Allow-Headers', 'Content-Type');

                return sudokuService.findAll({user_id: data.__user_id})
                    .then(sudokus => res.send(sudokus));
            })
        }


        function getSudokus(req, res) {


                res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                res.header('Access-Control-Allow-Headers', 'Content-Type');

                return sudokuService.findSud( req.params.id)
                    .then(sudokus => res.send(sudokus));

        }

        function generate(req, res) {
            jwt.verify(req.cookies[`x-access-token`], 'shhhhh', (err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(data);

                    res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
                    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                    res.header('Access-Control-Allow-Headers', 'Content-Type');



                    const puzzle = sudokuService.makepuzzle();
                    const solution = sudokuService.solvepuzzle(puzzle);
                    const difficulty = sudokuService.ratepuzzle(puzzle, req.query.select);
                    //req.query.select

                    return sudokuService.createOne({
                        user_id: data.__user_id,
                        answer: JSON.stringify(solution),
                        sudoku: JSON.stringify(puzzle),
                        complexity: difficulty
                    })
                        .then(sudoku => res.send(sudoku));
                }
            })
        }
    }

    return new DomainController(sudokuService, promiseHandler);
};