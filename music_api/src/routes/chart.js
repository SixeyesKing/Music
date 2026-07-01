const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/ChartController')

router.get('/', ctrl.getAllCharts.bind(ctrl))

module.exports = router
