const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const config = require('./config');
const errors = require('./utils/errors');

const dbContext = require('./context/db')(Sequelize, config);

const authService = require('./services/auth')(dbContext.user, dbContext.role, errors);
const sudokuService = require('./services/sudoku')(dbContext.sudoku, dbContext.role, errors);
const recordesService = require('./services/recorde')(dbContext.record, dbContext.role, errors);
const favoritesService = require('./services/sudoku')(dbContext.favorites, dbContext.role, errors);
const cacheService = require('./services/cache');

const apiController = require('./controllers/api')(authService, sudokuService, favoritesService, recordesService, config);

const logger = require('./utils/logger');
const auth = require('./utils/auth')(authService, config, errors);
const cache = require('./utils/cache')(cacheService);


const app = express();


app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/api',express.static('public/dynamic-html-client/docs'));

app.use('/api', logger);
app.use('/api', auth);
app.use('/api', apiController);

const port = process.env.PORT || 3000;
dbContext.sequelize
    .sync()
    .then(() => app.listen(port, () => console.log('Running on http://localhost:3000/vhod.html')))
    .catch(err => console.log(err));