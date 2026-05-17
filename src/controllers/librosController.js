const catalogoService = require('../services/catalogoService');

/**
 * Controlador para obtener todos los libros del catálogo.
 * 
 * Llama al servicio `catalogoService` para recuperar la lista completa
 * de libros disponibles en el sistema. Si la operación es exitosa,
 * responde con un JSON que incluye el total de libros y sus datos.
 * En caso de error inesperado, retorna un estado 500 con mensaje de error.
 * 
 * @param {import('express').Request} req - Objeto de solicitud HTTP (no requiere parámetros).
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 */
const getLibros = (req, res) => {
    try {
        // Se obtiene la lista completa de libros desde el servicio
        const libros = catalogoService.obtenerTodosLosLibros();

        // Respuesta exitosa con el total y los datos de los libros
        res.status(200).json({
            exito: true,
            total: libros.length,
            datos: libros
        });
    } catch (error) {
        // Si ocurre un error en el servicio, se responde con código 500
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
    }
};

/**
 * Controlador para obtener solo los libros con estado "disponible".
 * 
 * Invoca el servicio correspondiente que filtra los libros cuyo estado
 * es "disponible". Retorna una respuesta JSON con el total de libros
 * encontrados y sus datos. Si ocurre un fallo en el proceso, responde
 * con un código 500.
 * 
 * @param {import('express').Request} req - Objeto de solicitud HTTP (no requiere parámetros).
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 */
const getLibrosDisponibles = (req, res) => {
    try {
        // Se obtiene únicamente los libros con estado "disponible"
        const libros = catalogoService.obtenerLibrosDisponibles();

        // Respuesta exitosa con los libros disponibles
        res.status(200).json({
            exito: true,
            total: libros.length,
            datos: libros
        });
    } catch (error) {
        // Manejo de errores internos del servidor
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
    }
};

/**
 * Controlador para obtener libros filtrados por categoría.
 * 
 * Extrae el parámetro `categoria` desde la URL y lo valida antes de
 * consultar el servicio. Si el parámetro está vacío o ausente, retorna
 * un error 400 (solicitud incorrecta). Si no se encuentran libros para
 * esa categoría, retorna un 404. En caso de éxito, responde con los
 * libros que coinciden con la categoría indicada.
 * 
 * @param {import('express').Request} req - Objeto de solicitud HTTP. Debe incluir `req.params.categoria`.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 */
const getLibrosPorCategoria = (req, res) => {
    try {
        // Se extrae la categoría desde los parámetros de la URL
        const categoria = req.params.categoria;
        
        // Validación básica: la categoría no puede estar vacía ni ser solo espacios
        if (!categoria || categoria.trim() === '') {
            return res.status(400).json({ exito: false, mensaje: 'Debe especificar una categoría válida.' });
        }

        // Se consultan los libros que pertenecen a la categoría indicada
        const libros = catalogoService.obtenerLibrosPorCategoria(categoria);

        // Si el servicio no encuentra libros, se retorna un 404 con mensaje descriptivo
        if (libros.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: `No se encontraron libros para la categoría: "${categoria}".`
            });
        }

        // Respuesta exitosa con la categoría, total y datos de los libros encontrados
        res.status(200).json({
            exito: true,
            categoria: categoria,
            total: libros.length,
            datos: libros
        });
    } catch (error) {
        // Manejo de errores internos del servidor
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
    }
};

// Se exportan los controladores para ser usados en las rutas de la aplicación
module.exports = {
    getLibros,
    getLibrosDisponibles,
    getLibrosPorCategoria
};