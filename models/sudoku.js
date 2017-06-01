module.exports = (Sequelize, sequelize) => {
    return sequelize.define('sudoku', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        complexity: {
            type: Sequelize.STRING,
            allowedNull: false
        },
        sudoku: {
            type: Sequelize.STRING(4000) ,
            allowedNull: false
        },
        answer: {
            type: Sequelize.STRING,
            allowedNull: false
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowedNull: false
        }
    },

        {
        indexes: []
    });
};
