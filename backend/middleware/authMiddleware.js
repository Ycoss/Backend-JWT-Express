const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //obtenemos el token
            token = req.headers.authorization.split(' ')[1]

            //verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //obtener toda la info del usuario menos el password
            req.user = await User.findById(decoded.id_usuario).select('-password')

            if (!req.user) {
                res.status(401)
                throw new Error('Acceso no autorizado')
            }

            return next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Acceso no autorizado')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Acceso no autorizado, no se proporciono ningun token')
    }
})

module.exports = protect
