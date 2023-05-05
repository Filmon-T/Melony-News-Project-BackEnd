const News = require('../models/newsModel')
const User = require('../models/userModel')
const Categories = require('../models/categoryModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('../utils/appError')
const moment = require('moment')
const APIFeatures = require('./../utils/apiFeatures')

const currentTime = moment().format('dddd, MMMM Do, YYYY')

exports.getAllNews = catchAsync(async (req, res, next) => {
   // 1. Get news data from collection
   const news = await News.find()

   // 2. Build Template

   // 3. Render that template using news data from 1)

   res.status(200).render('overview', {
      title: 'All News',
      news,
      currentTime
   })
})

exports.getAllCategory = catchAsync(async (req, res, next) => {
   let filter = {}
   if (req.params.newsCategory)
      filter = { newsCategory: req.params.newsCategory }

   const features = new APIFeatures(Categories.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
   const doc = await features.query

   res.status(200).json({
      status: 'success!',
      results: doc.length,
      category: {
         data: doc
      }
   })
})

exports.getNewsByCategory = catchAsync(async (req, res, next) => {
   let filter = {}
   if (req.params.newsCategory)
      filter = { newsCategory: req.params.newsCategory }

   const features = new APIFeatures(News.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
   const doc = await features.query

   // res.status(200).json({
   //    status: 'success!',
   //    results: doc.length,
   //    data: {
   //       data: doc,
   //    },
   // })

   res.status(200).render('latest', {
      title: 'Ppppolitics News',
      news: { data: doc },
      currentTime
   })
})

exports.getNews = catchAsync(async (req, res, next) => {
   // 1) Get the data for the requested news (including comments and authors)

   const authors = await User.find({ role: 'author' })

   const news = await News.findOne({
      slug: req.params.slug
   }).populate({
      path: 'comments',
      fields: 'comment user'
   })

   // 2. Build Template

   // 3. Render that template using news data from 1)

   if (!news) {
      return next(new AppError('There is no news with that name', 404))
   }

   res.status(200).render('news', {
      title: `${news.newsTitle}`,
      news,
      currentTime,
      authors
   })
})

exports.getLogin = (req, res) => {
   res.status(200).render('login', {
      title: 'Login to Digital News',
      currentTime
   })
}

exports.getSignup = (req, res) => {
   res.status(200).render('signup', {
      title: 'Sign up to Digital News',
      currentTime
   })
}

exports.getAccount = (req, res) => {
   res.status(200).render('account', {
      title: 'Your account',
      currentTime
   })
}

exports.contactAdmin = (req, res) => {
   res.status(200).render('contact', {
      title: 'Contact Admin',
      currentTime
   })
}

// ADMIN

exports.getAdminLogin = (req, res) => {
   res.status(200).render('admin/login', {
      title: 'Digital News - Login',
      currentTime
   })
}

exports.getAdminHome = (req, res) => {
   res.status(200).render('admin/home', {
      title: 'Admin - Home',
      currentTime
   })
}

exports.getAdminProfile = (req, res) => {
   res.status(200).render('admin/profile', {
      title: 'Your account',
      currentTime
   })
}

// WITHOUT API

exports.updateUserData = catchAsync(async (req, res, next) => {
   const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
         name: req.body.name,
         email: req.body.email
      },
      {
         new: true,
         runValidators: true
      }
   )
   // console.log('this is shitty')
   res.status(200).render('account', {
      title: 'Your account',
      user: updatedUser
   })
})
