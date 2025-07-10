// routes/index.js
const express = require('express');
const routerPersonas = require('./personas.router');  // Asegúrate del nombre correcto del archivo
const router = express.Router();

// Montar el router de personas en /personas
router.use('/personas', routerPersonas);


module.exports = router;