const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/PicksController')

router.get('/data', ctrl.getData.bind(ctrl))

module.exports = router
