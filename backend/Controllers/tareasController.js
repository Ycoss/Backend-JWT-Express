const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const Tarea = require('../models/tareasModel')

//busca la tarea por id y verifica que pertenezca al usuario del token
//(se reutiliza en update y delete para no repetir la validacion - DRY)
const obtenerTareaPropia = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404)
        throw new Error('La tarea especificada no existe')
    }

    const tarea = await Tarea.findById(req.params.id)

    if (!tarea) {
        res.status(404)
        throw new Error('La tarea especificada no existe')
    }

    //el id del usuario siempre sale del token (req.user), nunca del body ni de la URL
    if (tarea.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Acceso no autorizado, la tarea no te pertenece')
    }

    return tarea
}

const getTareas = asyncHandler(async (req, res) => {
    const tareas = await Tarea.find({ user: req.user.id })
    res.status(200).json(tareas)
})

const createTareas = asyncHandler(async (req, res) => {
    if (!req.body || !req.body.descripcion) {
        res.status(400)
        throw new Error('Debes teclear una descripcion')
    }

    const tarea = await Tarea.create({
        user: req.user.id,
        descripcion: req.body.descripcion
    })

    res.status(201).json(tarea)
})

const updateTareas = asyncHandler(async (req, res) => {
    const tarea = await obtenerTareaPropia(req, res)

    if (!req.body || !req.body.descripcion) {
        res.status(400)
        throw new Error('Debes teclear una descripcion')
    }

    tarea.descripcion = req.body.descripcion
    const tareaUpdated = await tarea.save()

    res.status(200).json(tareaUpdated)
})

const deleteTareas = asyncHandler(async (req, res) => {
    const tarea = await obtenerTareaPropia(req, res)

    await tarea.deleteOne()

    res.status(200).json({ id: req.params.id })
})

module.exports = { getTareas, createTareas, updateTareas, deleteTareas }
