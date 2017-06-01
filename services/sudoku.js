module.exports = (sudokuRepository, errors) => {
    const _ = require('underscore');

    //
    // function findLast() {
    //     return new Promise((resolve, reject) => {
    //         sudokuRepository
    //             .findOne({ limit :1 , attributes: ['id'],order:[['id','DESC']] })
    //             .then(sudoku => {
    //                 resolve(sudoku);
    //
    //             })
    //             .catch(reject);
    //     });
    // }

    function findLast(content) {
        return sudokuRepository.findAll({ limit :1 , attributes: ['id'], order:[['id','DESC']] })
    }
    function findSud(sud) {
        return sudokuRepository.findAll({where:{id:sud}, attributes: ['sudoku'] })
    }

    function makepuzzle(board) {
        const puzzle  = [];
        const deduced = makeArray(81, null);
        const order   = _.range(81);

        shuffleArray(order);

        for (let i = 0; i < order.length; i++) {
            const pos = order[i];

            if (!deduced[pos]) {
                puzzle.push({pos:pos, num:board[pos]});
                deduced[pos] = board[pos];
                deduce(deduced);
            }
        }

        shuffleArray(puzzle);

        for (let i = puzzle.length - 1; i >= 0; i--) {
            const e = puzzle[i];
            removeElement(puzzle, i);

            const rating = checkpuzzle(boardforentries(puzzle), board);
            if (rating === -1) puzzle.push(e);
        }

        return boardforentries(puzzle);
    }

    function ratepuzzle(puzzle, samples) {
        let total = 0;

        for (let i = 0; i < samples; i++) {
            const tuple = solveboard(puzzle);

            if (!tuple.answer) return -1;

            total += tuple.state.length;
        }

        return total / samples;
    }

    function checkpuzzle(puzzle, board) {
        if (board === undefined) board = null;

        const tuple1 = solveboard(puzzle);
        if (!tuple1.answer) return -1;
        if (board && !boardmatches(board, tuple1.answer)) return -1;

        const difficulty = tuple1.state.length;
        const tuple2 = solvenext(tuple1.state);

        if (tuple2.answer) return -1;

        return difficulty;
    }

    function solvepuzzle(board) {
        return solveboard(board).answer;
    }

    function solveboard(original) {
        const board = [].concat(original);
        const guesses = deduce(board);

        if (!guesses) return {state:[], answer:board};

        const track = [{guesses:guesses, count:0, board:board}];
        return solvenext(track);
    }

    function solvenext(remembered) {
        while (remembered.length > 0) {
            const tuple1 = remembered.pop();

            if (tuple1.count >= tuple1.guesses.length) continue;

            remembered.push({guesses:tuple1.guesses, count:tuple1.count+1, board:tuple1.board});
            const workspace = [].concat(tuple1.board);
            const tuple2    = tuple1.guesses[tuple1.count];

            workspace[tuple2.pos] = tuple2.num;

            const guesses = deduce(workspace);

            if (!guesses) return {state:remembered, answer:workspace};

            remembered.push({guesses:guesses, count:0, board:workspace});
        }

        return {state:[], answer:null};
    }

    function deduce(board) {
        while (true) {
            let stuck = true;
            let guess = null;
            let count = 0;

            // fill in any spots determined by direct conflicts
            let tuple1  = figurebits(board);
            let allowed = tuple1.allowed;
            let needed  = tuple1.needed;

            for (let pos = 0; pos < 81; pos++) {
                if (board[pos] === null) {
                    let numbers = listbits(allowed[pos]);
                    if (!numbers.length) {
                        return [];
                    }
                    else if (numbers.length === 1) {
                        board[pos] = numbers[0];
                        stuck = false;
                    }
                    else if (stuck) {
                        let t = _.map(numbers, function(val) {
                            return {pos:pos, num:val};
                        });

                        let tuple2 = pickbetter(guess, count, t);
                        guess = tuple2.guess;
                        count = tuple2.count;
                    }
                }
            }

            if (!stuck) {
                let tuple3  = figurebits(board);
                allowed = tuple3.allowed;
                needed  = tuple3.needed;
            }

            // fill in any spots determined by elimination of other locations
            for (let axis = 0; axis < 3; axis++) {
                for (let x = 0; x < 9; x++) {
                    let numbers = listbits(needed[axis * 9 + x]);

                    for (let i = 0; i < numbers.length; i++) {
                        let n     = numbers[i];
                        let bit   = 1 << n;
                        let spots = [];

                        for (let y = 0; y < 9; y++) {
                            let pos = posfor(x, y, axis);
                            if (allowed[pos] & bit) {
                                spots.push(pos);
                            }
                        }

                        if (spots.length === 0) {
                            return [];
                        }
                        else if (spots.length === 1) {
                            board[spots[0]] = n;
                            stuck = false;
                        }
                        else if (stuck) {
                            let t = _.map(spots, function(val) {
                                return {pos:val, num:n};
                            });

                            let tuple4 = pickbetter(guess, count, t);
                            guess = tuple4.guess;
                            count = tuple4.count;
                        }
                    }
                }
            }

            if (stuck) {
                if (guess) {
                    shuffleArray(guess);
                }

                return guess;
            }
        }
    }

    function figurebits(board) {
        let needed  = [];
        let allowed = _.map(board, function(val) {
            return !val ? 511 : 0;
        }, []);

        for (let axis = 0; axis < 3; axis++) {
            for (let x = 0; x < 9; x++) {
                let bits = axismissing(board, x, axis);
                needed.push(bits);

                for (let y = 0; y < 9; y++) {
                    const pos = posfor(x, y, axis);
                    allowed[pos] = allowed[pos] & bits;
                }
            }
        }

        return {allowed:allowed, needed:needed};
    }

    function posfor(x, y, axis) {
        if (axis === undefined) { axis = 0; }

        if (axis === 0) {
            return x * 9 + y;
        }
        else if (axis === 1) {
            return y * 9 + x;
        }

        return ([0,3,6,27,30,33,54,57,60][x] + [0,1,2,9,10,11,18,19,20][y])
    }

    function axismissing(board, x, axis) {
        let bits = 0;

        for (let y = 0; y < 9; y++) {
            let e = board[posfor(x, y, axis)];

            if (e !== null) {
                bits |= 1 << e;
            }
        }

        return 511 ^ bits;
    }

    function listbits(bits) {
        let list = [];
        for (let y = 0; y < 9; y++) {
            if ((bits & (1 << y)) !== 0) {
                list.push(y);
            }
        }

        return list;
    }

    function pickbetter(b, c, t) {
        if (!b || t.length < b.length) {
            return {guess:t, count:1};
        }
        else if (t.length > b.length) {
            return {guess:b, count:c};
        }
        else if (randomInt(c) === 0) {
            return {guess:t, count:c+1};
        }

        return {guess:b, count:c+1};
    }

    function boardforentries(entries) {
        let board = _.map(_.range(81), () => {
            return null;
        });

        for (let i = 0; i < entries.length; i++) {
            let item = entries[i];
            let pos  = item.pos;

            board[pos] = item.num;
        }

        return board;
    }

    function boardmatches(b1, b2) {
        for (let i = 0; i < 81; i++) {
            if (b1[i] !== b2[i]) {
                return false;
            }
        }

        return true;
    }

    function randomInt(max) {
        return Math.floor(Math.random() * (max+1));
    }

    function shuffleArray(original) {
        // Swap each element with another randomly selected one.
        for (let i = 0; i < original.length; i++) {
            let j = i;
            while (j === i) {
                j = Math.floor(Math.random() * original.length);
            }
            let contents = original[i];
            original[i]  = original[j];
            original[j]  = contents;
        }
    }

    function removeElement(array, from, to) {
        const rest = array.slice((to || from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    }

    function makeArray(length, value) {
        return _.map(_.range(length), () => {
            return value;
        })
    }

    function createOne(content) {
        return sudokuRepository.create(content)
    }

    function findAll(content) {
        return sudokuRepository.findAll(content)
    }


   return {
       makepuzzle  : () => makepuzzle(solvepuzzle(makeArray(81, null))),
       solvepuzzle : solvepuzzle,
       ratepuzzle  : ratepuzzle,
       posfor      : posfor,

       createOne: createOne,
       findAll: findAll,
       findLast: findLast,
       findSud: findSud
    };
};
