const Category = require('./../models/categoryModel')
const factory = require('./handlerFactory')
const multer = require('multer')

exports.setUserIds = (req, res, next) => {
   //Allow nested routes
   if (!req.body.user) {
      // console.log('error there')
      req.body.newsAuthor = req.user.id
   }
   next()
}

exports.getAllCategories = factory.getAll(Category)
exports.getCategory = factory.getOne(Category)
exports.createCategory = factory.createOne(Category)
exports.updateCategory = factory.updateOne(Category)
exports.deleteCategory = factory.deleteOne(Category)
