const News = require('./../models/newsModel')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')
const AppError = require('../utils/appError')
const APIFeatures = require('./../utils/apiFeatures')
const moment = require('moment')
const multer = require('multer')
const fs = require('fs')

exports.setUserIds = (req, res, next) => {
   //Allow nested routes
   if (!req.body.user) {
      // console.log('error there')
      req.body.newsAuthor = res.locals.user.id
   }
   // console.log(res.locals.user.id)
   next()
}

const multerStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'public/images/news/')
   },
   filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1]
      const nowTime = moment().format('dddd, MMMM D, YYYY h-mm A')
      cb(
         null,
         `${req.body.newsTitle} - ${file.originalname} - ${
            req.user.name
         } - ${nowTime}.${ext}`
      )
   }
})

const multerFilter = (req, file, cb) => {
   if (file.mimetype.startsWith('image')) {
      cb(null, true)
   } else {
      cb(new AppError('Not an image! Please upload only images.', 400), false)
   }
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

// console.log(upload)

// exports.uploadNewsPhoto = upload.fields([
//    { name: 'newsMainPicture' },
//    { name: 'newsDetailImages' },
// ])
exports.uploadNewsPhoto = upload.single('newsMainPicture')

const filterObj = (obj, ...allowedFields) => {
   const newObj = {}
   Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el]
   })
   return newObj
}

exports.aliasTopNews = (req, res, next) => {
   req.query.limit = '5'
   req.query.sort = 'createdAt'

   req.query.fields = 'newsTitle, newsContent, newsCategory, newsAuthor'
   next()
}

exports.searchNews = catchAsync(async (req, res, next) => {
   //    let filter = {}
   //    if (req.params.newsId) filter = { news: req.params.newsId }

   //    const features = new APIFeatures(
   //       News.find({
   //          newsTitle: new RegExp(`${req.query.q}`, 'i'),
   //       }),
   //       req.query
   //    )
   //       .filter()
   //       .sort()
   //       .limitFields()
   //       .paginate()
   //    const search = await features.query

   const search = await News.find({
      newsTitle: new RegExp(`${req.query.q}`, 'i')
   })
   res.status(200).json({
      status: 'success!',
      searchresults: search.length,
      data: search
   })
})

exports.getAllNews = factory.getAll(News)
exports.getNew = factory.getOne(News, { path: 'comments' })
// exports.createNew = factory.createOne(News)

exports.createNew = catchAsync(async (req, res, next) => {
   // 2. Filter out field names that are not allowed to be updated
   req.body.newsAuthor = res.locals.user.id
   req.body.createdAt = moment(Date.now()).format(
      'dddd, MMMM D, YYYY h:mm:ss A'
   )
   const filteredBody = filterObj(
      req.body,
      'newsTitle',
      'newsCategory',
      'newsContent',
      'newsSource',
      'newsAuthor',
      'breakingNews',
      'createdAt'
   )

   // console.log(req)
   if (req.file) filteredBody.newsMainPicture = req.file.filename

   // console.log(req.body)
   // 3. Update user document
   const doc = await News.create(filteredBody)
   res.status(201).json({
      status: 'success',
      data: {
         data: doc
      }
   })
})

// exports.updateNew = factory.updateOne(News)

exports.updateNew = catchAsync(async (req, res, next) => {
   const fetchNews = await News.findById(req.params.id)

   if (!fetchNews) {
      return next(
         new AppError('Sorry, There is No news found with that ID', 404)
      )
   }

   // if (req.user._id == fetchNews.newsAuthor.id) {
   if (req.file) req.body.newsMainPicture = req.file.filename

   const doc = await News.findByIdAndUpdate(req.params.id, req.body, {
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
   // } else {
   //    return next(
   //       new AppError(
   //          'You cannot delete or update news posted by other authors!',
   //          404
   //       )
   //    )
   // }
})

exports.deleteNew = factory.deleteOne(News)

// exports.deleteNew = catchAsync(async (req, res, next) => {
//    const fetchNews = await News.findById(req.params.id)

//    if (!fetchNews) {
//       return next(
//          new AppError('Sorry, There is No news found with that ID', 404)
//       )
//    }

//    if (req.user._id == fetchNews.newsAuthor.id) {
//       //console.log('this is the correct user')
//       const doc = await News.findByIdAndDelete(req.params.id)

//       if (!doc) {
//          return next(new AppError('No document found with that ID', 404))
//       }

//       res.status(204).json({
//          status: 'success',
//          data: 'Null'
//       })
//    } else {
//       return next(
//          new AppError(
//             'You cannot delete or update news posted by other authors!',
//             404
//          )
//       )
//    }
// })

exports.getNewsStats = catchAsync(async (req, res, next) => {
   const stats = await Tour.aggregate([
      {
         $match: { ratingsAverage: { $gte: 4.2 } }
      },
      {
         $group: {
            _id: { $toUpper: '$difficulty' },
            numTours: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
         }
      },
      {
         $sort: { avgPrice: 1 }
      }
   ])

   res.status(200).json({
      status: 'success',
      data: {
         tour: stats
      }
   })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
   const year = req.params.year * 1
   const plan = await Tour.aggregate([
      {
         $unwind: '$startDates'
      },
      {
         $match: {
            startDates: {
               $gte: new Date(`${year}-01-01`),
               $lte: new Date(`${year}-12-31`)
            }
         }
      },
      {
         $group: {
            _id: { $month: `$startDates` },
            numTourStarts: { $sum: 1 },
            tours: { $push: '$name' }
         }
      },
      {
         $addFields: { month: '$_id' }
      },
      {
         $project: {
            _id: 0
         }
      },
      {
         $sort: { numTourStarts: -1 }
      },
      {
         $limit: 12
      }
   ])

   res.status(200).json({
      status: 'success',
      data: {
         tour: plan
      }
   })
})
