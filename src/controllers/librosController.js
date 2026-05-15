const catalogoService = require('../services/catalogoService');

const getLibros = (req, res) => {
    try {
        const libros = catalogoService.obtenerTodosLosLibros();
        res.status(200).json({
            exito: true,
            total: libros.length,
            datos: libros
        });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
    }
};

const getLibrosDisponibles = (req, res) => {
    try {
        const libros = catalogoService.obtenerLibrosDisponibles();
        res.status(200).json({
            exito: true,
            total: libros.length,
            datos: libros
        });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
    }
};

const getLibrosPorCategoria = (req, res) => {
    try {
        const categoria = req.params.categoria;
        
        // Validación básica de parámetro vacío
        if (!categoria || categoria.trim() === '') {
            return res.status(400).json({ exito: false, mensaje: 'Debe especificar una categoría válida.' });
        }

        const libros = catalogoService.obtenerLibrosPorCategoria(categoria);

        if (libros.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: `No se encontraron libros para la categoría: "${categoria}".`
            });
        }

        res.status(200).json({
            exito: true,
            categoria: categoria,
            total: libros.length,
            datos: libros
        });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
    }
};

module.exports = {
    getLibros,
    getLibrosDisponibles,
    getLibrosPorCategoria
};