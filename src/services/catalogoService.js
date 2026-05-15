const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Ruta absoluta al archivo HTML
const HTML_PATH = path.join(__dirname, '../../public/catalogo.html');

const obtenerTodosLosLibros = () => {
    try {
        const html = fs.readFileSync(HTML_PATH, 'utf-8');
        const $ = cheerio.load(html);
        const libros = [];

        // Iterar sobre cada libro en el catálogo
        $('#catalogo .libro').each((index, element) => {
            const el = $(element);
            
            libros.push({
                id: parseInt(el.attr('data-id')),
                categoria: el.attr('data-categoria'),
                titulo: el.find('.titulo').text().trim(),
                autor: el.find('.autor').text().trim(),
                isbn: el.find('.isbn').text().replace('ISBN:', '').trim(),
                anio: parseInt(el.find('.anio').text().replace('Año:', '').trim()),
                editorial: el.find('.editorial').text().replace('Editorial:', '').trim(),
                estado: el.find('.estado').hasClass('disponible') ? 'disponible' : 'prestado',
                ubicacion: el.find('.ubicacion').text().trim()
            });
        });

        return libros;
    } catch (error) {
        throw new Error('Error al leer o procesar el catálogo HTML');
    }
};

const obtenerLibrosDisponibles = () => {
    const libros = obtenerTodosLosLibros();
    return libros.filter(libro => libro.estado === 'disponible');
};

const obtenerLibrosPorCategoria = (categoria) => {
    const libros = obtenerTodosLosLibros();
    return libros.filter(libro => libro.categoria.toLowerCase() === categoria.toLowerCase());
};

module.exports = {
    obtenerTodosLosLibros,
    obtenerLibrosDisponibles,
    obtenerLibrosPorCategoria
};