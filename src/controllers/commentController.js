const Comment = require('./../models/commentModel')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')
const AppError = require('../utils/appError')

exports.setNewsUserIds = (req, res, next) => {
   //Allow nested routes
   if (!req.body.news) {
      // console.log('error here')
      req.body.news = req.params.newsId
   }
   if (!req.body.user) {
      // console.log('error there')
      req.body.user = req.user.id
   }
   next()
}

exports.getAllReviews = factory.getAll(Comment)
exports.getReview = factory.getOne(Comment)
exports.createReview = factory.createOne(Comment)
//exports.updateReview = factory.updateOne(Comment)

exports.updateReview = catchAsync(async (req, res, next) => {
   const fetchComment = await Comment.findById(req.params.id)

   if (!fetchComment) {
      return next(
         new AppError('Sorry, There is No comment found with that ID', 404)
      )
   }

   if (req.user._id == fetchComment.user.id) {
      const doc = await Comment.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true
      })

      if (!doc) {
         return next(new AppError('No document found with that ID', 404))
      }

      res.status(200).json({
         status: 'success',
         data: {
            data: doc
         }
      })
   } else {
      return next(
         new AppError(
            'You cannot delete or update a comment that is not yours!',
            404
         )
      )
   }
})

// exports.deleteReview = factory.deleteOne(Comment);
exports.deleteReview = catchAsync(async (req, res, next) => {
   const fetchComment = await Comment.findById(req.params.id)

   if (!fetchComment) {
      return next(
         new AppError('Sorry, There is No comment found with that ID', 404)
      )
   }

   if (req.user._id == fetchComment.user.id) {
      //console.log('this is the correct user')
      const doc = await Comment.findByIdAndDelete(req.params.id)

      if (!doc) {
         return next(new AppError('No document found with that ID', 404))
      }

      res.status(204).json({
         status: 'success',
         data: 'Null'
      })
   } else {
      return next(
         new AppError(
            'You cannot delete or update a comment that is not yours!',
            404
         )
      )
   }
   //////

   /////////
})
