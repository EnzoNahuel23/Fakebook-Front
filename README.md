# Fakebook - Interfaz de Usuario

Red social retro inspirada en Facebook 2009. Frontend desarrollado con React + TypeScript para la materia Construcción de Interfaces de Usuario (UnaHur).

## Funcionalidades

- Registro e inicio de sesión con nickName (contraseña fija: `123456`)
- Feed de publicaciones con imágenes, etiquetas y comentarios
- Filtro de publicaciones por etiqueta
- Vista de detalle de publicación con formulario para comentar
- Creación de publicaciones con URLs de imágenes y selección de etiquetas
- Perfil de usuario con listado de sus publicaciones
- Sidebar con juegos clásicos de Facebook 2009 (estético)
- Diseño responsive con temática Facebook 2009

## Tecnologías

- React 19 + TypeScript 6
- Vite 8
- react-router-dom 7
- Bootstrap 5
- DiceBear API (avatares)

## Instalación y uso

```bash
npm install
npm run dev
```

La app se abre en `http://localhost:5173`.

## API

Consume el backend en `http://localhost:3000/api`.

Endpoints disponibles:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/usuarios | Listar usuarios |
| POST | /api/usuarios | Crear usuario |
| GET | /api/publicaciones | Listar publicaciones |
| GET | /api/publicaciones/:id | Detalle de publicación |
| GET | /api/publicaciones?userId=xxx | Publicaciones de un usuario |
| POST | /api/publicaciones | Crear publicación |
| PUT | /api/publicaciones/:id/etiquetas | Agregar etiquetas |
| GET | /api/comentarios/publicacion/:postId | Comentarios de un post |
| POST | /api/comentarios | Crear comentario |
| GET | /api/etiquetas | Listar etiquetas |

## Repositorio del Backend

[Anti-Social Documental TP](https://github.com/EnzoNahuel23/Fakebook-Back)
