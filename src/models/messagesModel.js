const mongoose = require('mongoose')
// const News = require('./newsModel')

const messageSchema = new mongoose.Schema(
   {
      receiver: {
         type: mongoose.Schema.ObjectId,
         ref: 'Receiver',
         required: [true, 'You must specify the right admin'],
      },

      sender: {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
         required: [
            true,
            'Your account is not valid to send messages to the admin',
         ],
      },

      message: {
         type: String,
         required: [true, 'You must enter your message to contact the admin!'],
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

messageSchema.pre(/^find/, function (next) {
   // this.populate({
   //     path: 'news',
   //     select: 'newsTitle'
   // }).populate({
   //   path: 'user',
   //   select: 'name photo'
   // });

   this.populate({
      path: 'sender',
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

messageSchema.pre(/^findOneAnd/, async function (next) {
   this.r = await this.findOne()
   //console.log(this.r);
   next()
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
