const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorMiddleware')

const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/tareas', require('./routes/tareasRoutes'))
app.use('/api/users', require('./routes/usersRoutes'))
app.use(errorHandler)

//en macOS el puerto 5000 lo ocupa AirPlay Receiver (*:5000), por eso escuchamos
//explicitamente en localhost IPv4 e IPv6 para que Postman llegue a nuestra API
app.listen(port, '127.0.0.1', () => {
    console.log(`Servidor Iniciado en el puerto ${port}`)
})
app.listen(port, '::1')
