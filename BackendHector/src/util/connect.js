const {Sequelize} = require('sequelize')
require('dotenv').config()

// Opción 1: Usar URL completa (recomendado)
const sequelize = new Sequelize(process.env.APP_DATABASE);

// Opción 2: Usar variables separadas (descomenta si prefieres esta opción)
// const sequelize = new Sequelize(
//   process.env.DB_NAME || 'nombre_base_datos',
//   process.env.DB_USER || 'usuario',
//   process.env.DB_PASSWORD || 'contraseña',
//   {
//     host: process.env.DB_HOST || 'localhost',
//     port: process.env.DB_PORT || 5432,
//     dialect: 'postgres'
//   }
// );

module.exports = sequelize;