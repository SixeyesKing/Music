const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/FavoriteController')

router.get('/', ctrl.getFavorites.bind(ctrl))
router.post('/', ctrl.addFavorite.bind(ctrl))
router.delete('/:songId', ctrl.removeFavorite.bind(ctrl))

module.exports = router
