const {getAll, create, getOne, remove, update, search} = require ('../controllers/personas.controllers');
const express = require('express');
const routerPersonas = express.Router()

routerPersonas.route('/')
    .get(getAll)
    .post(create)

routerPersonas.route('/search')
    .get(search)

routerPersonas.route('/:id')
    .get(getOne)
    .delete(remove)
    .put(update)

    module.exports = routerPersonas;