const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('libreria', 'root', '1234', {
    host: 'localhost', 
    dialect: 'mysql'
});

const Autor = sequelize.define('Autor',{
    nombre: {
        type: Sequelize.STRING,
        validate: {
            is: ["[a-z]","i"],
            len: 23,
        }
    },

});

const Libro = sequelize.define('Libro', {

});

module.exports = Autor;