'use strict';



const Sequelize = require('sequelize');
const assert = require("assert");
const sinon = require('sinon');
const should = require('should');
const config = require('../config');
const dbcontext = require('../context/db')(Sequelize, config);
const errors = require('../utils/errors');
const Promise = require("bluebird");

let userRepository = dbcontext.user;
let favoriteRepository = dbcontext.favorites;
let sudokuRepository = dbcontext.sudoku;
let recordRepository = dbcontext.record;

const userService = require('../services/auth')(userRepository, errors);
const favoriteService = require('../services/favorites')(favoriteRepository, errors);
const sudokuService = require('../services/sudoku')(sudokuRepository, errors);
const recordService = require('../services/recorde')(recordRepository, errors);


const register1 = {
    email: 'skormash@gmail.com',
    password: '12345',
    fullname: 'Skorobogataya Masha'
};

const user1 = {
    id: '1',
    email: 'skormash@gmail.com',
    password: '12345'
};

const user2 = {
    id: '1',
    email: 'skormash@gmail.com',
    password: '12345'
};

let sandbox;

beforeEach(() => sandbox = sinon.sandbox.create());

afterEach(() => sandbox.restore());

describe('Сервис auth', () => {
    describe('Функция register', () => {
        it('Отдавать объект', () => {
            sandbox.stub(userRepository, 'create').returns(Promise.resolve(null));
            let promise = userService.register(register1);
            return promise.then(result => result.should.be.an.Object())
        });
    });

    describe('Функция login', () => {
        it('Выбрасывать ошибку, если пароль неправильный', () => {
            sandbox.stub(userRepository, 'findOne').returns(Promise.resolve());
            let promise = userService.login(user1);
            return promise.catch(err => err.status.should.be.equal(errors.wrongCredentials.status))
        });

        it('Отдавать объект, если пароль правильный', () => {
            sandbox.stub(userRepository, 'findOne').returns(Promise.resolve(user1));
            let promise = userService.login(user2);
            return promise.then(result => result.should.be.an.String())
        });
    });
});

describe('Сервис favorite', () => {
    describe('Функция createOne', () => {
        it('Отдавать объект', () => {
            sandbox.stub(favoriteRepository, 'create').returns(Promise.resolve(null));
            const favorite = favoriteService.createOne({user_id: 1, sudoku_id: 1});
            favorite.should.be.an.Object();
        });
    });

    describe('Функция findAll', () => {
        it('Отдавать объект', () => {
            sandbox.stub(favoriteRepository, 'findAll').returns(Promise.resolve(null));
            const favorite = favoriteService.findAll({where: {user_id: 1}});
            favorite.should.be.an.Object();
        });
    });
});

describe('Сервис recorde', () => {
    describe('Функция createOne', () => {
        it('Отдавать объект', () => {
            sandbox.stub(recordRepository, 'create').returns(Promise.resolve(null));
            const recorde = recordService.createOne({user_id: 1, sudoku_id: 1, time: Date.now()});
            recorde.should.be.an.Object();
        });
    });

    describe('Функция findOne', () => {
        it('Отдавать объект', () => {
            const recorde = recordService.isExisting('00:03:04');
            return recorde.then(data => data.should.be.equal(true));
        });
    });

    describe('Функция rand', () => {
        it.only('Отдавать объект', () => {
            const recorde = recordService.rand();
            recorde.should.be.equal(true);
        });
    });


});

const sudoku = '[null,null,2,null,5,null,null,7,8,1,null,null,8,null,null,null,null,null,8,5,null,0,null,null,3,null,null,null,null,7,null,2,null,null,null,null,4,null,null,null,null,7,null,null,null,0,null,1,null,null,null,null,5,null,null,3,null,null,0,6,null,null,2,null,null,null,null,null,null,null,4,7,null,null,4,null,null,null,null,null,null]';
const answer = '[3,4,2,6,5,1,0,7,8,1,7,0,8,3,2,4,6,5,8,5,6,0,7,4,3,2,1,5,6,7,1,2,0,8,3,4,4,8,3,5,6,7,2,1,0,0,2,1,3,4,8,7,5,6,7,3,5,4,0,6,1,8,2,6,0,8,2,1,3,5,4,7,2,1,4,7,8,5,6,0,3]';
const sudoku12 = [null,null,2,null,5,null,null,7,8,1,null,null,8,null,null,null,null,null,8,5,null,0,null,null,3,null,null,null,null,7,null,2,null,null,null,null,4,null,null,null,null,7,null,null,null,0,null,1,null,null,null,null,5,null,null,3,null,null,0,6,null,null,2,null,null,null,null,null,null,null,4,7,null,null,4,null,null,null,null,null,null];


describe('Сервис sudoku', () => {
    describe('Функция createOne', () => {
        it('Отдавать объект', () => {
            sandbox.stub(sudokuRepository, 'create').returns(Promise.resolve(null));
            const sudoku1 = sudokuService.createOne({
                user_id: 1,
                answer: answer,
                sudoku: sudoku,
                complexity: 4
            });
            sudoku1.should.be.an.Object();
        });
    });

    describe('Функция findAll', () => {
        it('Отдавать объект', () => {
            sandbox.stub(sudokuRepository, 'findAll').returns(Promise.resolve(null));
            const sudoku1 = sudokuService.findAll({where: {user_id: 1}});
            sudoku1.should.be.an.Object();
        });
    });

    describe('Функция findLast', () => {
        it('Отдавать объект', () => {
            sandbox.stub(sudokuRepository, 'findAll').returns(Promise.resolve(null));
            const sudoku1 = sudokuService.findLast();
            sudoku1.should.be.an.Object();
        });
    });

    describe('Функция findSud', () => {
        it('Отдавать объект', () => {
            sandbox.stub(sudokuRepository, 'findAll').returns(Promise.resolve(null));
            const sudoku1 = sudokuService.findSud(1);
            sudoku1.should.be.an.Object();
        });
    });

    describe('Функция findAll', () => {
        it('Отдавать объект', () => {
            sandbox.stub(recordRepository, 'findAll').returns(Promise.resolve(null));
            const recorde = recordService.findAll({where: {user_id: 1}});
            recorde.should.be.an.Object();
        });
    });

    describe('Функция findAll', () => {
        it('Отдавать объект', () => {
            sandbox.stub(recordRepository, 'findAll').returns(Promise.resolve(null));
            const recorde = recordService.findAll({where: {user_id: 1}});
            recorde.should.be.an.Object();
        });
    });

    describe('Функция makepuzzle', () => {
        it('Отдавать объект', () => {
            sandbox.stub(sudokuRepository, 'create').returns(Promise.resolve(null));
            const makepuzzle = sudokuService.makepuzzle();
            makepuzzle.should.be.an.Array();
        });
    });

    describe('Функция solvepuzzle', () => {
        it('Отдавать объект', () => {
            sandbox.stub(sudokuRepository, 'create').returns(Promise.resolve(null));
            const solvepuzzle = sudokuService.solvepuzzle(sudoku12);
            solvepuzzle.should.be.an.Object();
        });
    });

    describe('Функция ratepuzzle', () => {
        it('Отдавать объект', () => {
            sandbox.stub(sudokuRepository, 'create').returns(Promise.resolve(null));
            const ratepuzzle = sudokuService.ratepuzzle(sudoku, 1);
            ratepuzzle.should.be.an.Number();
        });
    });
});















