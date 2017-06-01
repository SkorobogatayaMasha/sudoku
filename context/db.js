global.isProd=process.env.type=="prod";
module.exports = (Sequelize, config) => {
    const options = {
        host: isProd?config.db_heroku.host:config.db.host,
        dialect: isProd?config.db_heroku.dialect:config.db.dialect,
        logging: false,
        port:isProd?config.db_heroku.port:config.db.port
    };

    const sequelize = new Sequelize(isProd?config.db_heroku.name:config.db.name,
                                    isProd?config.db_heroku.user:config.db.user,
                                    isProd?config.db_heroku.password:config.db.password,
                                    options);
    const user = require('../models/user')(Sequelize, sequelize);
    const sudoku = require('../models/sudoku')(Sequelize, sequelize);
    const record = require('../models/record')(Sequelize, sequelize);
    const favorites = require('../models/favorites')(Sequelize, sequelize);

    return { user: user, sudoku: sudoku, record: record, sequelize: sequelize, favorites: favorites};
};