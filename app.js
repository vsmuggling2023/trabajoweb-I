
const express = require('express');
const path = require('path');
const app = express();
const librosRoutes = require('./src/routes/librosRoutes');

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/libros', librosRoutes);

app.get(['/','/catalogo'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'catalogo.html'));
});

// Manejo de rutas inexistentes (404 general)
app.use((req, res) => {
    // Si la petición acepta HTML, mostrar página 404 simple
    if (req.accepts('html')) {
        return res.status(404).send('<h1>404 - Página no encontrada</h1>');
    }
    // Si es API, responder JSON
    res.status(404).json({ exito: false, mensaje: 'Ruta no encontrada.' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});