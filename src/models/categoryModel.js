const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
   {
      categoryName: {
         type: String,
         required: [true, 'A category must have a title!'],
         unique: true,
         trim: true,
      },
      createdAt: {
         // type: Date,
         // default: Date.now(),
      },
   },
   {
      toJSON: {
         virtuals: true,
      },
      toObj: {
         virtuals: true,
      },
   }
)

// // Query Middleware
// categorySchema.pre(/^find/, function (next) {
//    this.find({
//       hiddenNews: {
//          $ne: true,
//       },
//    })
//    this.start = Date.now()
//    next()
// })

// categorySchema.post(/^find/, function (docs, next) {
//    console.log(`Query took ${Date.now() - this.start} milliseconds`)
//    next()
// })

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
