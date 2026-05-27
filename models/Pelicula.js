const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Pelicula = sequelize.define('Pelicula', {

    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    genero: {
        type: DataTypes.STRING,
        allowNull: false
    }

});

module.exports = Pelicula;