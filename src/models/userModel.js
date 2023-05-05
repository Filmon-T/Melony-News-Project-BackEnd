const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const userSchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         required: [true, 'Please enter your first name!']
      },
      lastName: {
         type: String,
         required: [true, 'Please enter your last name!']
      },

      email: {
         type: String,
         required: [true, 'Please enter your email!'],
         unique: true,
         lowercase: true,
         validate: [validator.isEmail, 'Please provide a valid email']
      },

      photo: { type: String, default: 'default2.jpg' },

      role: {
         type: String,
         enum: [
            'user',
            'admin',
            'superadmin',
            'reporter',
            'editor',
            'mcr_person',
            'anchor',
            'executor'
         ],
         default: 'user'
      },
      password: {
         type: String,
         required: [true, 'Please enter your password!'],
         minlength: 8,
         select: false
      },

      passwordConfirm: {
         type: String,
         required: [true, 'Please confirm your password'],
         validate: {
            // This only works on create
            validator: function(el) {
               return el === this.password
            },
            message: 'Password are not the same!'
         }
      },

      division: {
         type: mongoose.Schema.ObjectId,
         ref: 'Division'
      },

      passwordChangedAt: Date,

      passwordResetToken: String,

      passwordResetExpires: Date,

      active: {
         type: Boolean,
         default: true,
         select: false
      }
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true
      },
      toObj: {
         virtuals: true
      }
   }
)

userSchema.pre('save', async function(next) {
   // Only run this function if password was actually modified
   if (!this.isModified('password')) return next()

   // Encrypt the password with cost of 12
   this.password = await bcrypt.hash(this.password, 12)
   // Delete passwordConfirm field
   this.passwordConfirm = undefined
   next()
})

userSchema.pre('save', function(next) {
   if (!this.isModified('password') || this.isNew) return next()

   this.passwordChangedAt = Date.now() - 1000
   next()
})

userSchema.pre(/^find/, function(next) {
   this.populate({
      path: 'division',
      select: '-__v'
   })
   next()
})

userSchema.pre(/^find/, function(next) {
   // This points to the current query
   this.find({ active: { $ne: false } })
   next()
})

userSchema.methods.correctPassword = async function(
   candidatePassword,
   userPassword
) {
   return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
   if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
         this.passwordChangedAt.getTime() / 1000,
         10
      )
      //console.log(changedTimestamp, JWTTimestamp);
      return JWTTimestamp < changedTimestamp
   }
   return false
}

userSchema.methods.createPasswordResetToken = function() {
   const resetToken = crypto.randomBytes(32).toString('hex')

   this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
   console.log({ resetToken }, this.passwordResetToken)
   this.passwordResetExpires = Date.now() + 10 * 60 * 1000

   return resetToken
}

userSchema.methods.changePassword = function() {
   this.passsword = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
   this.passwordChangedAt = Date.now() - 1000

   return resetToken
}

module.exports = mongoose.model('User', userSchema)
