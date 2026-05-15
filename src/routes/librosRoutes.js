const express = require('express');
const router = express.Router();
const librosController = require('../controllers/librosController');

// GET /api/libros
router.get('/', librosController.getLibros);

// GET /api/libros/disponibles
router.get('/disponibles', librosController.getLibrosDisponibles);

// GET /api/libros/categoria/:categoria
router.get('/categoria/:categoria', librosController.getLibrosPorCategoria);

module.exports = router;