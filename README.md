# Backend JWT Express

API REST en Node.js + Express + MongoDB con registro de usuarios, login con JWT y un CRUD de tareas protegido con Bearer Token. Cada usuario solo puede ver, modificar y eliminar sus propias tareas.

## Instalación

```bash
git clone https://github.com/Ycoss/Backend-JWT-Express.git
cd Backend-JWT-Express
npm install
```

Crear un archivo `.env` a partir de `.env.example` con los valores de `PORT`, `MONGO_DB` y `JWT_SECRET`.

## Ejecución

```bash
npm start
```

El servidor corre en `http://localhost:5000`.

## Endpoints

| Método | Ruta | Descripción | ¿Requiere token? |
| --- | --- | --- | --- |
| POST | `/api/users` | Crear usuario | No |
| POST | `/api/users/login` | Iniciar sesión y devolver el JWT | No |
| GET | `/api/users/datos` | Datos del usuario dueño del token | Sí |
| GET | `/api/tareas` | Listar las tareas del usuario logueado | Sí |
| POST | `/api/tareas` | Crear una tarea | Sí |
| PUT | `/api/tareas/:id` | Modificar una tarea propia | Sí |
| DELETE | `/api/tareas/:id` | Eliminar una tarea propia | Sí |

Las rutas protegidas usan el header `Authorization: Bearer <token>`.
