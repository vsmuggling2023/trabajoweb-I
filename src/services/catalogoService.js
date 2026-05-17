const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Ruta absoluta al archivo HTML que contiene el catálogo de libros
const HTML_PATH = path.join(__dirname, '../../public/catalogo.html');

/**
 * Obtiene todos los libros del catálogo leyendo y parseando el archivo HTML.
 * 
 * Utiliza el módulo `fs` para leer el archivo HTML de forma síncrona,
 * y la librería `cheerio` para hacer scraping del DOM y extraer los datos
 * de cada libro. Por cada elemento con la clase `.libro` dentro del
 * contenedor `#catalogo`, se construye un objeto con los atributos y
 * textos relevantes (título, autor, ISBN, año, editorial, estado y ubicación).
 * 
 * @returns {Array<Object>} Lista de objetos representando cada libro del catálogo.
 * @throws {Error} Si ocurre un problema al leer o procesar el archivo HTML.
 */
const obtenerTodosLosLibros = () => {
    try {
        // Se lee el archivo HTML del catálogo de forma síncrona
        const html = fs.readFileSync(HTML_PATH, 'utf-8');

        // Se carga el HTML en cheerio para poder manipularlo como un DOM
        const $ = cheerio.load(html);

        // Arreglo donde se almacenarán los objetos de cada libro
        const libros = [];

        // Iterar sobre cada elemento libro dentro del catálogo
        $('#catalogo .libro').each((index, element) => {
            const el = $(element);
            
            // Se extraen los atributos y el texto de cada campo del libro
            libros.push({
                id: parseInt(el.attr('data-id')),                                          // ID numérico del libro
                categoria: el.attr('data-categoria'),                                      // Categoría del libro (atributo HTML)
                titulo: el.find('.titulo').text().trim(),                                  // Título del libro
                autor: el.find('.autor').text().trim(),                                    // Nombre del autor
                isbn: el.find('.isbn').text().replace('ISBN:', '').trim(),                 // Código ISBN sin prefijo
                anio: parseInt(el.find('.anio').text().replace('Año:', '').trim()),        // Año de publicación como número
                editorial: el.find('.editorial').text().replace('Editorial:', '').trim(),  // Nombre de la editorial
                estado: el.find('.estado').hasClass('disponible') ? 'disponible' : 'prestado', // Estado según clase CSS
                ubicacion: el.find('.ubicacion').text().trim()                             // Ubicación física del libro
            });
        });

        return libros;
    } catch (error) {
        // Si el archivo no existe o hay un error de parseo, se lanza una excepción descriptiva
        throw new Error('Error al leer o procesar el catálogo HTML');
    }
};

/**
 * Obtiene únicamente los libros con estado "disponible".
 * 
 * Reutiliza `obtenerTodosLosLibros` y aplica un filtro para retornar
 * solo aquellos libros cuya propiedad `estado` sea igual a "disponible".
 * 
 * @returns {Array<Object>} Lista de libros disponibles para préstamo.
 */
const obtenerLibrosDisponibles = () => {
    // Se obtiene el listado completo y se filtra por estado "disponible"
    const libros = obtenerTodosLosLibros();
    return libros.filter(libro => libro.estado === 'disponible');
};

/**
 * Obtiene los libros que pertenecen a una categoría específica.
 * 
 * Reutiliza `obtenerTodosLosLibros` y filtra los resultados comparando
 * la categoría de cada libro con el parámetro recibido, ignorando
 * diferencias entre mayúsculas y minúsculas (comparación insensible a case).
 * 
 * @param {string} categoria - Nombre de la categoría por la cual filtrar.
 * @returns {Array<Object>} Lista de libros que pertenecen a la categoría indicada.
 */
const obtenerLibrosPorCategoria = (categoria) => {
    // Se obtiene el listado completo y se filtra comparando categorías en minúsculas
    const libros = obtenerTodosLosLibros();
    return libros.filter(libro => libro.categoria.toLowerCase() === categoria.toLowerCase());
};

// Se exportan las funciones del servicio para ser usadas por los controladores
module.exports = {
    obtenerTodosLosLibros,
    obtenerLibrosDisponibles,
    obtenerLibrosPorCategoria
};