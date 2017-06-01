module.exports = (Sequelize, sequelize) => {
    return sequelize.define('records', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowedNull: false
        },
        sudoku_id: {
            type: Sequelize.INTEGER,
            allowedNull: false
        },
        time: {
            type: Sequelize.TIME,
            allowedNull: false
        }
    }, {
        indexes: []
    });
};
