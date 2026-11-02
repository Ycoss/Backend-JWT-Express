const express = require('express')
const router = express.Router()
const { getTareas, createTareas, updateTareas, deleteTareas } = require('../Controllers/tareasController')
const protect = require('../middleware/authMiddleware')

router.get('/', protect, getTareas)
router.post('/', protect, createTareas)
router.put('/:id', protect, updateTareas)
router.delete('/:id', protect, deleteTareas)

module.exports = router
