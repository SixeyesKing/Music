const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/RecommendController')

router.get('/banners', ctrl.getBanners.bind(ctrl))
router.get('/events', ctrl.getEvents.bind(ctrl))
router.get('/data', ctrl.getRecommendData.bind(ctrl))

module.exports = router
