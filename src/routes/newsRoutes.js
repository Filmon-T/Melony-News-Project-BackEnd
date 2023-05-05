const express = require('express')
const newsController = require('./../controllers/newsController')
const authController = require('./../controllers/authController')
const reviewRouter = require('./../routes/reviewRoutes')

const router = express.Router()

router.use('/:newsId/comments', reviewRouter)

router
   .route('/latest-news')
   .get(newsController.aliasTopNews, newsController.getAllNews)

// router.route('/news-stats').get(newsController.getNewsStats)
router
   .route('/')
   .get(
      // authController.protect_vue,
      authController.vueIsLoggedIn,
      newsController.getAllNews
   )
   .post(
      authController.protect,
      authController.restrictTo('admin', 'reporter'),
      newsController.setUserIds,
      newsController.uploadNewsPhoto,
      newsController.createNew
   )

router.route('/search').get(newsController.searchNews)

router
   .route('/:id')
   .get(newsController.getNew)
   .patch(
      authController.protect,
      authController.restrictTo('admin', 'reporter'),
      newsController.uploadNewsPhoto,
      newsController.updateNew
   )
   .delete(
      authController.protect,
      authController.restrictTo('admin', 'reporter'),
      newsController.deleteNew
   )

module.exports = router
