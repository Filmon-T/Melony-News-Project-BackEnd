const mongoose = require('mongoose')
const slugify = require('slugify')
const User = require('./userModel')

const moment = require('moment')

const newsSchema = new mongoose.Schema(
   {
      newsTitle: {
         type: String,
         required: [true, 'A news must have a title!'],
         unique: true,
         trim: true,
         maxlength: [
            200,
            'A news title must have less or equal to 200 characters'
         ]
      },

      slug: String,

      newsMainPicture: {
         type: String,
         required: [true, 'A news must have a picture']
      },

      newsImages: [
         {
            type: String
         }
      ],

      newsSource: {
         type: String,
         trim: true
      },

      newsCategory: [
         {
            type: mongoose.Schema.ObjectId,
            ref: 'Category'
         }
      ],

      newsType: {
         type: String,
         enum: ['AVO', 'RVO'],
         required: [true, 'A news must have a type!']
      },

      headline: {
         type: String,
         required: [true, 'A news must have a headline!'],
         trim: true
      },

      newsContent: {
         type: String,
         required: [true, 'A news must have a content'],
         trim: true
      },

      division: {
         type: mongoose.Schema.ObjectId,
         ref: 'Division'
      },

      newsAuthor: {
         type: mongoose.Schema.ObjectId,
         ref: 'User'
      },

      createdAt: {
         // type: Date,
         // default: Date.now(),
         // select: false,
      },

      hiddenNews: {
         type: Boolean,
         default: false
      },

      breakingNews: {
         type: Boolean,
         default: false
      }
   },
   {
      toJSON: {
         virtuals: true
      },
      toObj: {
         virtuals: true
      }
   }
)

// tourSchema.index({price: 1, ratingsAverage: -1});
// tourSchema.index({slug: 1});

// Virtual populate
// !! IMPORTANT TO BE CHECKED
newsSchema.virtual('comments', {
   ref: 'Comment',
   foreignField: 'news',
   localField: '_id'
})
// console.log(moment(Date.now()).format('dddd, MMMM D, YYYY h-mm A'))
// DOCUMENT MIDDLEWARE: runs before .save() and .create()
newsSchema.pre('save', function(next) {
   this.slug = slugify(this.newsTitle, {
      lower: true
   })
   next()
})

// Query Middleware
newsSchema.pre(/^find/, function(next) {
   this.find({
      hiddenNews: {
         $ne: true
      }
   })
   this.start = Date.now()
   next()
})

newsSchema.pre(/^find/, function(next) {
   this.populate({
      path: 'division',
      select: '-__v'
   })
   next()
})

newsSchema.pre(/^find/, function(next) {
   this.populate({
      path: 'newsAuthor',
      select: '-__v -passwordChangedAt'
   })
   next()
})

newsSchema.pre(/^find/, function(next) {
   this.populate({
      path: 'newsCategory'
      // select: '-__v -passwordChangedAt',
   })
   next()
})

newsSchema.post(/^find/, function(docs, next) {
   console.log(`Query took ${Date.now() - this.start} milliseconds`)
   next()
})

const News = mongoose.model('News', newsSchema)

module.exports = News
