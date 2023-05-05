const mongoose = require('mongoose')
const News = require('./newsModel')

const commentSchema = new mongoose.Schema(
   {
      comment: {
         type: String,
         required: [true, 'Comment can not be empty!'],
      },
      createdAt: {
         // type: Date,
         // default: Date.now(),
      },
      news: {
         type: mongoose.Schema.ObjectId,
         ref: 'News',
         required: [true, 'Comment must belong to a news'],
      },
      user: {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
         required: [true, 'Comment must belong to a user'],
      },
      commentUpdatedAt: Date,
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

commentSchema.index({ news: 1, user: 1 }, { unique: true })

commentSchema.pre(/^find/, function (next) {
   // this.populate({
   //     path: 'news',
   //     select: 'newsTitle'
   // }).populate({
   //   path: 'user',
   //   select: 'name photo'
   // });

   this.populate({
      path: 'user',
      select: 'name photo',
   })
   next()
})

// commentSchema.pre(['updateOne', 'findByIdAndDelete'], function (next) {
//    console.log('this will be good')
//    //this.r = await this.findOne()
//    console.log(this.r)
//    next()
// })

commentSchema.pre(/^findOneAnd/, async function (next) {
   this.r = await this.findOne()
   //console.log(this.r);
   next()
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
