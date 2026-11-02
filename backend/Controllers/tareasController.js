const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const Tarea = require('../models/tareasModel')

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404)
        throw new Error('La tarea especificada no existe')
    }

    //primero verificamos que la tarea exista
    const tarea = await Tarea.findById(req.params.id)

    if (!tarea) {
        res.status(404)
        throw new Error('La tarea especificada no existe')
    }

    //verificamos que la tarea pertenezca al usuario del token
    if (tarea.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Acceso no autorizado')
    } else {
        const tareaUpdated = await Tarea.findByIdAndUpdate(
            req.params.id,
            { descripcion: req.body.descripcion },
            { new: true }
        )
        res.status(200).json(tareaUpdated)
    }
})

const deleteTareas = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404)
        throw new Error('La tarea especificada no existe')
    }

    //primero verificamos que la tarea exista
    const tarea = await Tarea.findById(req.params.id)

    if (!tarea) {
        res.status(404)
        throw new Error('La tarea especificada no existe')
    }

    //verificamos que la tarea pertenezca al usuario del token
    if (tarea.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Acceso no autorizado')
    } else {
        await Tarea.deleteOne({ _id: tarea._id })
        res.status(200).json({ id: req.params.id })
    }
})

module.exports = { getTareas, createTareas, updateTareas, deleteTareas }
