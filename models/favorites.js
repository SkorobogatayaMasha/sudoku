module.exports = (Sequelize, sequelize) => {
    return sequelize.define('favorites', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        sudoku_id: {
            type: Sequelize.INTEGER
        }
    });
};