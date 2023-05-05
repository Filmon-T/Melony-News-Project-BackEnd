const express = require('express')
const messageController = require('./../controllers/messagesController')
const authController = require('./../controllers/authController')

const router = express.Router({ mergeParams: true })

// router.use(authController.protect)

router.use(authController.protect_vue)

router
   .route('/')
   .get(authController.restrictTo('admin'), messageController.getAllMessages)
   .post(
      authController.restrictTo('user', 'author'),
      messageController.setNewsUserIds,
      messageController.createMessage
   )
router
   .route('/:id')
   .get(authController.restrictTo('admin'), messageController.getMessage)
   .patch(
      authController.restrictTo('user', 'admin'),
      messageController.updateMessage
   )
   .delete(
      authController.restrictTo('user', 'admin'),
      messageController.deleteMessage
   )

module.exports = router
