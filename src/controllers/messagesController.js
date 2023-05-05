const Message = require('./../models/messagesModel')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')
const AppError = require('../utils/appError')

exports.setNewsUserIds = (req, res, next) => {
   //Allow nested routes
   // if (!req.body.news) {
   //    // console.log('error here')
   //    req.body.news = req.params.newsId
   // }
   if (!req.body.user) {
      // console.log(req.user.id)
      req.body.user = req.user.id
   }
   if (!req.body.sender) {
      // console.log(req.user.id)
      req.body.sender = req.user.id
   }
   next()
}

exports.getAllMessages = factory.getAll(Message)
exports.getMessage = factory.getOne(Message)
exports.createMessage = factory.createOne(Message)
// exports.createMessage = catchAsync(async (req, res, next) => {
//    console.log(req.body)
//    const doc = await Message.create(req.body)
//    // console.log(req)
//    res.status(201).json({
//       status: 'success',
//       data: {
//          data: doc,
//       },
//    })
// })

exports.updateMessage = factory.updateOne(Message)
exports.deleteMessage = factory.deleteOne(Message)
// exports.updateMessage = catchAsync(async (req, res, next) => {
//    const fetchMessage = await Message.findById(req.params.id)

//    if (!fetchMessage) {
//       return next(
//          new AppError('Sorry, There is No comment found with that ID', 404)
//       )
//    }

//    if (req.user._id == fetchMessage.user.id) {
//       const doc = await Message.findByIdAndUpdate(req.params.id, req.body, {
//          new: true,
//          runValidators: true,
//       })

//       if (!doc) {
//          return next(new AppError('No document found with that ID', 404))
//       }

//       res.status(200).json({
//          status: 'success',
//          data: {
//             data: doc,
//          },
//       })
//    } else {
//       return next(
//          new AppError(
//             'You cannot delete or update a comment that is not yours!',
//             404
//          )
//       )
//    }
// })

// exports.deleteReview = catchAsync(async (req, res, next) => {
//    const fetchMessage = await Message.findById(req.params.id)

//    if (!fetchMessage) {
//       return next(
//          new AppError('Sorry, There is No comment found with that ID', 404)
//       )
//    }

//    if (req.user._id == fetchMessage.user.id) {
//       //console.log('this is the correct user')
//       const doc = await Message.findByIdAndDelete(req.params.id)

//       if (!doc) {
//          return next(new AppError('No document found with that ID', 404))
//       }

//       res.status(204).json({
//          status: 'success',
//          data: 'Null',
//       })
//    } else {
//       return next(
//          new AppError(
//             'You cannot delete or update a comment that is not yours!',
//             404
//          )
//       )
//    }
//////

/////////
// })
