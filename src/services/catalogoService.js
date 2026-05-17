const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio'); // Librería que parsea HTML en Node.js con sintaxis tipo jQuery ($). Se usa porque los datos están en un HTML, no en una base de datos.

// Ruta absoluta al archivo HTML que contiene el catálogo de libros.
// Se usa path.join para que la ruta funcione en cualquier sistema operativo (Windows, Linux, Mac).
const HTML_PATH = path.join(__dirname, '../../public/catalogo.html');

/**
 * Obtiene todos los libros del catálogo leyendo y parseando el archivo HTML.
 * 
 * Utiliza `fs.readFileSync` (lectura síncrona) para simplificar el código.
 * Luego, `cheerio` parsea el HTML y permite recorrer el DOM para extraer
 * los datos de cada libro. Retorna un array de objetos con la info de cada libro.
 * 
 * @returns {Array<Object>} Lista de objetos con los datos de cada libro.
 * @throws {Error} Si el archivo HTML no existe o no se puede procesar.
 */
const obtenerTodosLosLibros = () => {
    try {
        // readFileSync bloquea el hilo hasta terminar la lectura (síncrono).
        // En producción sería mejor readFile (asíncrono) para no bloquear el event loop de Node.js,
        // pero aquí se usa readFileSync por simplicidad al ser un proyecto académico.
        const html = fs.readFileSync(HTML_PATH, 'utf-8');

        // cheerio.load() convierte el string HTML en un objeto manipulable con sintaxis jQuery.
        // El símbolo $ funciona igual que en jQuery: permite seleccionar elementos por CSS selectors.
        const $ = cheerio.load(html);

        // Arreglo vacío donde se irán almacenando los objetos de cada libro
        const libros = [];

        // .each() itera sobre todos los elementos .libro dentro de #catalogo,
        // similar a un forEach pero usando selectores CSS en vez de un array JS.
        $('#catalogo .libro').each((index, element) => {
            const el = $(element);
            
            libros.push({
                id: parseInt(el.attr('data-id')),                                          // data-id es un atributo HTML personalizado (data attribute); parseInt lo convierte a número entero
                categoria: el.attr('data-categoria'),                                      // Se lee el atributo data-categoria directamente del elemento HTML
                titulo: el.find('.titulo').text().trim(),                                  // .find() busca un descendiente con clase .titulo; .text() extrae el texto visible; .trim() elimina espacios
                autor: el.find('.autor').text().trim(),                                    // Mismo patrón: buscar elemento, obtener texto, limpiar espacios
                isbn: el.find('.isbn').text().replace('ISBN:', '').trim(),                 // Se elimina el prefijo "ISBN:" con replace() para dejar solo el código limpio
                anio: parseInt(el.find('.anio').text().replace('Año:', '').trim()),        // Se elimina el prefijo "Año:" y se convierte a número entero con parseInt
                editorial: el.find('.editorial').text().replace('Editorial:', '').trim(),  // Mismo patrón: quitar prefijo "Editorial:" y limpiar espacios
                estado: el.find('.estado').hasClass('disponible') ? 'disponible' : 'prestado', // Si el span tiene la clase CSS "disponible" → estado disponible; de lo contrario → prestado
                ubicacion: el.find('.ubicacion').text().trim()                             // Ubicación física del libro dentro de la biblioteca
            });
        });

        return libros;
    } catch (error) {
        // Si el archivo no existe o hay error de parseo, se lanza un Error con mensaje claro.
        // El controller capturará este error y responderá con HTTP 500 sin exponer detalles internos.
        throw new Error('Error al leer o procesar el catálogo HTML');
    }
};

/**
 * Obtiene únicamente los libros con estado "disponible".
 * 
 * Reutiliza `obtenerTodosLosLibros` y aplica un filtro con .filter(),
 * evitando duplicar la lógica de lectura del HTML.
 * 
 * @returns {Array<Object>} Lista de libros disponibles para préstamo.
 */
const obtenerLibrosDisponibles = () => {
    const libros = obtenerTodosLosLibros(); // Se reutiliza la función principal para no duplicar la lógica de lectura del HTML
    return libros.filter(libro => libro.estado === 'disponible'); // .filter() devuelve un nuevo array solo con los libros que cumplan la condición
};

/**
 * Obtiene los libros que pertenecen a una categoría específica.
 * 
 * Filtra comparando en minúsculas para que la búsqueda sea insensible
 * a mayúsculas/minúsculas (case-insensitive). Por ejemplo: "Tecnología"
 * y "tecnología" darán el mismo resultado.
 * 
 * @param {string} categoria - Nombre de la categoría a buscar.
 * @returns {Array<Object>} Lista de libros que pertenecen a esa categoría.
 */
const obtenerLibrosPorCategoria = (categoria) => {
    const libros = obtenerTodosLosLibros(); // Se reutiliza la función principal para no duplicar la lógica de lectura del HTML
    // .toLowerCase() en ambos lados hace la comparación case-insensitive:
    // "Tecnología" === "tecnología" → true, así no importa cómo escriba el usuario la categoría
    return libros.filter(libro => libro.categoria.toLowerCase() === categoria.toLowerCase());
};

// Se exportan las tres funciones del servicio para que puedan ser usadas por los controladores
module.exports = {
    obtenerTodosLosLibros,
    obtenerLibrosDisponibles,
    obtenerLibrosPorCategoria
};