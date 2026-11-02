# Backend en Node.js + Express con Autenticación JWT

**Universidad Anáhuac Mayab | Ingeniería de Software**  
**Actividad:** API REST con autenticación JWT y CRUD de tareas protegido por usuario.

---

## Descripción del Proyecto

API REST desarrollada con **Node.js**, **Express** y **MongoDB (Mongoose)** que implementa:
- **Registro de usuarios** con encriptación de contraseñas mediante `bcrypt`.
- **Inicio de sesión (Login)** que genera y firma un **JSON Web Token (JWT)** con validez de 30 días.
- **Middleware de protección (`protect`)** que valida el header `Authorization: Bearer <token>` en todas las rutas privadas y adjunta el usuario autenticado en `req.user`.
- **CRUD de tareas con aislamiento por usuario**: cada tarea almacena el `ObjectId` de su creador (`user: req.user.id`), garantizando que cada usuario únicamente pueda listar, crear, modificar y eliminar sus propias tareas.

---

## Estructura del Proyecto

```text
├── backend/
│   ├── Controllers/
│   │   ├── tareasController.js   # Lógica CRUD de tareas con validación de propietario
│   │   └── usersControllers.js   # Registro, login (emisión de JWT) y perfil de usuario
│   ├── config/
│   │   └── db.js                 # Conexión a MongoDB con Mongoose
│   ├── middleware/
│   │   ├── authMiddleware.js     # Middleware protect (validación de Bearer Token JWT)
│   │   └── errorMiddleware.js    # Manejador centralizado de errores HTTP
│   ├── models/
│   │   ├── tareasModel.js        # Esquema de Tarea (referencia a User + descripcion)
│   │   └── usersModel.js         # Esquema de Usuario (nombre, email único, password hash)
│   ├── routes/
│   │   ├── tareasRoutes.js       # Rutas /api/tareas protegidas con middleware protect
│   │   └── usersRoutes.js        # Rutas /api/users (públicas y privada /datos)
│   └── server.js                 # Punto de entrada de la aplicación Express
├── .env.example                  # Plantilla de variables de entorno (sin secretos reales)
├── .gitignore                    # Exclusión de node_modules/ y .env
├── package.json
└── README.md
```

---

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Ycoss/Backend-JWT-Express.git
   cd Backend-JWT-Express
   ```

2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Configurar las variables de entorno creando un archivo `.env` en la raíz a partir de `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Variables requeridas en `.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_DB=mongodb://127.0.0.1:27017/tareas_anahuac
   JWT_SECRET=tu_clave_secreta_jwt
   ```

---

## Ejecución

- **Modo normal (Node.js):**
  ```bash
  npm start
  ```
- **Modo desarrollo (con recarga automática vía `nodemon`):**
  ```bash
  npm run server
  ```

El servidor quedará escuchando en `http://localhost:5000`.

---

## Lista de Endpoints de la API

### Rutas de Usuarios (`/api/users`)

| Método | Ruta | Descripción | ¿Requiere Token? |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/users` | Crear / registrar un nuevo usuario (`crearUser`) | No |
| `POST` | `/api/users/login` | Iniciar sesión y devolver el JWT (`loginUser`) | No |
| `GET` | `/api/users/datos` | Obtener los datos del usuario dueño del token (`datosUser`) | **Sí** (`Bearer <token>`) |

### Rutas de Tareas (`/api/tareas`)

Todas las rutas de tareas están protegidas por el middleware `protect` y requieren el header:
```http
Authorization: Bearer <token>
```

| Método | Ruta | Descripción | ¿Requiere Token? |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/tareas` | Listar únicamente las tareas del usuario autenticado (`getTareas`) | **Sí** |
| `POST` | `/api/tareas` | Crear una tarea asignada al usuario autenticado (`createTareas`) | **Sí** |
| `PUT` | `/api/tareas/:id` | Modificar una tarea propia (`updateTareas`) | **Sí** |
| `DELETE` | `/api/tareas/:id` | Eliminar una tarea propia (`deleteTareas`) | **Sí** |

---

## Reglas de Seguridad Implementadas

1. **Autenticación con Bearer Token (`protect`)**: Si una petición a `/api/tareas` o `/api/users/datos` no incluye un token válido en `Authorization: Bearer <token>`, el middleware responde inmediatamente con `401 Unauthorized`.
2. **Identidad obtenida exclusivamente del JWT**: El identificador del usuario se extrae del payload verificado del token (`req.user.id`), nunca del `body` ni de los parámetros de la URL.
3. **Aislamiento estricto por propietario**:
   - `GET /api/tareas` filtra con `Tarea.find({ user: req.user.id })`.
   - `PUT /api/tareas/:id` y `DELETE /api/tareas/:id` verifican `tarea.user.toString() !== req.user.id`. Si otro usuario intenta modificar o eliminar una tarea ajena, la API rechaza la operación con `401 Unauthorized` y el documento original permanece intacto.
