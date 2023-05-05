const express = require('express')
const viewsController = require('../controllers/viewsController')
const authController = require('./../controllers/authController')
const newsController = require('./../controllers/newsController')

const router = express.Router()

router.get('/', authController.isLoggedIn, viewsController.getAllNews)
router.get('/news', authController.isLoggedIn, viewsController.getNews)
router.get('/news/:slug', authController.isLoggedIn, viewsController.getNews)
router.get('/login', authController.isLoggedIn, viewsController.getLogin)
router.get('/signup', authController.isLoggedIn, viewsController.getSignup)
router.get('/me', authController.protect, viewsController.getAccount)

router.get('/contact', authController.protect, viewsController.contactAdmin)

router.get('/poletica-news', viewsController.getNewsByCategory)

// ADMIN

router.get(
   '/admin/login',
   authController.isLoggedIn,
   viewsController.getAdminLogin
)
router.get('/admin/', authController.isLoggedIn, viewsController.getAdminHome)
router.get(
   '/admin/profile',
   authController.isLoggedIn,
   viewsController.getAdminProfile
)

// WITHOUT API

router.post(
   '/submit-user-data',
   authController.protect,
   viewsController.updateUserData
)

module.exports = router
