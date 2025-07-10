const{ DataTypes } = require('sequelize')
const sequelize = require('../util/connect')

const Personas = sequelize.define('personas', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido_paterno: {
        type: DataTypes.STRING,
        allowNull: false
    },
     apellido_materno: {
        type: DataTypes.STRING,
        allowNull: false
    },
     direccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
     telefono: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false 
});

module.exports = Personas;