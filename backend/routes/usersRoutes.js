const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')

const { crearUser, loginUser, datosUser } = require('../Controllers/usersControllers')

//endpoints publicos
router.post('/', crearUser)
router.post('/register', crearUser)
router.post('/login', loginUser)

//endpoint privado
router.get('/datos', protect, datosUser)

module.exports = router
