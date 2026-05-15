<div align="center">
	<h1>📚 Biblioteca IP Santo Tomás - Catálogo de Libros</h1>
	<p><em>Conocimiento al alcance de todos</em></p>
	<img src="https://img.shields.io/badge/Node.js-Express-green" alt="Node.js Express" />
	<img src="https://img.shields.io/badge/Cheerio-HTML%20Scraping-blue" alt="Cheerio" />
</div>

---

## Descripción

Este proyecto es una API RESTful construida con **Node.js**, **Express** y **Cheerio** que permite consultar el catálogo de libros de la Biblioteca IP Santo Tomás. Los datos se extraen dinámicamente desde un archivo HTML usando Cheerio, lo que facilita la actualización del catálogo sin necesidad de una base de datos.

## Estructura del Proyecto

```
├── app.js
├── package.json
├── public/
│   └── catalogo.html
├── src/
│   ├── controllers/
│   │   └── librosController.js
│   ├── routes/
│   │   └── librosRoutes.js
│   └── services/
│       └── catalogoService.js
└── README.md
```

## Endpoints Disponibles

| Método | Endpoint                        | Descripción                                      |
|--------|----------------------------------|--------------------------------------------------|
| GET    | `/api/libros`                   | Lista todos los libros del catálogo               |
| GET    | `/api/libros/disponibles`       | Lista solo los libros disponibles                 |
| GET    | `/api/libros/categoria/:cat`    | Lista libros por categoría                        |

## Instalación y Uso

1. **Clona el repositorio:**
	 ```bash
	 git clone <url-del-repo>
	 cd actividad_2_6_cheerio
	 ```
2. **Instala las dependencias:**
	 ```bash
	 npm install
	 ```
3. **Ejecuta el servidor:**
	 ```bash
	 node app.js
	 ```
4. **Abre en tu navegador:**
	 [http://localhost:3000/catalogo](http://localhost:3000/catalogo)

## Ejemplo de Respuesta

```json
{
	"exito": true,
	"total": 2,
	"datos": [
		{
			"id": 1,
			"categoria": "programacion",
			"titulo": "Introducción a los Algoritmos",
			"autor": "Thomas H. Cormen",
			"isbn": "978-0-262-03384-8",
			"anio": 2022,
			"editorial": "MIT Press",
			"estado": "disponible",
			"ubicacion": "Estante A-12"
		}
	]
}
```

## Tecnologías Utilizadas

- Node.js
- Express
- Cheerio
- HTML/CSS

## Créditos

Desarrollado por [Fran Perez - Victor Perez - Renato Rubilar].

---

<div align="center">
	<sub>2026 &copy; IP Santo Tomás. Proyecto académico.</sub>
</div>
