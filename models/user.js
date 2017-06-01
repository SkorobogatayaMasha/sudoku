module.exports = (Sequelize, sequelize) => {
    return sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type:  Sequelize.STRING,
            allowedNull: false,
            unique:true,
            validate:{
                isEmail: true
            }
        },
        password: Sequelize.STRING,
        fullname: Sequelize.STRING,
        cache: {
            type: Sequelize.INTEGER,
            defaultValue: 100
        }
    }, {
        indexes: [{
            unique: true,
            fields: ['email']
        } ]
    });
};