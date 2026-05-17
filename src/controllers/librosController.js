// El controller maneja la capa HTTP: recibe el req, valida parámetros y envía el res.
// El service (catalogoService) contiene la lógica de negocio y no sabe nada de HTTP.
// Esta separación se llama arquitectura en capas (Layered Architecture).
const catalogoService = require('../services/catalogoService');

/**
 * Controlador para obtener todos los libros del catálogo.
 * 
 * Llama al service para recuperar todos los libros. Si tiene éxito,
 * responde con HTTP 200 y los datos. Si el service lanza un error,
 * el catch lo captura y responde con HTTP 500 para no exponer el error interno.
 * 
 * @param {import('express').Request} req - Objeto de solicitud HTTP (no requiere parámetros).
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 */
const getLibros = (req, res) => {
    try {
        const libros = catalogoService.obtenerTodosLosLibros(); // Se delega la lógica al service; el controller solo se encarga de la respuesta HTTP

        // HTTP 200 = OK. Se retorna un JSON con el total de registros y los datos completos.
        // Incluir "total" es una buena práctica en APIs REST para que el cliente sepa cuántos registros hay sin contarlos.
        res.status(200).json({
            exito: true,
            total: libros.length, // Cantidad de libros encontrados
            datos: libros          // Array con los objetos de cada libro
        });
    } catch (error) {
        // Si el service lanza un Error, se captura aquí y se responde con HTTP 500 (Internal Server Error).
        // Se usa try/catch aquí porque el service usa readFileSync que puede fallar si el archivo no existe.
        // El mensaje de error interno NO se expone al cliente por seguridad.
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
    }
};

/**
 * Controlador para obtener solo los libros con estado "disponible".
 * 
 * Invoca el service que filtra los libros disponibles. El filtrado
 * ocurre en el service, no aquí; el controller solo maneja la respuesta.
 * 
 * @param {import('express').Request} req - Objeto de solicitud HTTP (no requiere parámetros).
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 */
const getLibrosDisponibles = (req, res) => {
    try {
        const libros = catalogoService.obtenerLibrosDisponibles(); // El service se encarga de filtrar; el controller solo gestiona la respuesta HTTP

        res.status(200).json({ // HTTP 200 = OK. Respuesta exitosa con los libros disponibles
            exito: true,
            total: libros.length,
            datos: libros
        });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' }); // HTTP 500 = Internal Server Error
    }
};

/**
 * Controlador para obtener libros filtrados por categoría.
 * 
 * Extrae el parámetro `categoria` de la URL y lo valida antes de
 * consultar el service. Si falta el parámetro → 400. Si no hay
 * resultados → 404. Si hay resultados → 200 con los datos.
 * 
 * @param {import('express').Request} req - Objeto de solicitud. Debe incluir `req.params.categoria`.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 */
const getLibrosPorCategoria = (req, res) => {
    try {
        const categoria = req.params.categoria; // req.params contiene los segmentos dinámicos de la URL, ej: /libros/categoria/:categoria
        
        // HTTP 400 = Bad Request: el cliente envió una solicitud inválida (falta el parámetro requerido).
        // Es distinto al 404: aquí el problema es la petición mal formada, no que el recurso no exista.
        if (!categoria || categoria.trim() === '') {
            return res.status(400).json({ exito: false, mensaje: 'Debe especificar una categoría válida.' });
        }

        const libros = catalogoService.obtenerLibrosPorCategoria(categoria); // El service hace la búsqueda; el controller valida y responde

        // HTTP 404 = Not Found: la categoría existe como ruta válida, pero no hay libros para ese valor.
        // Se usa 404 y no 200 con array vacío para que el cliente sepa que no hubo resultados.
        if (libros.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: `No se encontraron libros para la categoría: "${categoria}".`
            });
        }

        // HTTP 200 = OK. Se incluye la categoría buscada en la respuesta para que el cliente confirme qué buscó.
        res.status(200).json({
            exito: true,
            categoria: categoria, // Se repite la categoría en la respuesta como buena práctica en APIs REST
            total: libros.length,
            datos: libros
        });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' }); // HTTP 500 = Internal Server Error
    }
};

// Se exportan los tres controladores para ser registrados como handlers en las rutas de Express
module.exports = {
    getLibros,
    getLibrosDisponibles,
    getLibrosPorCategoria
};