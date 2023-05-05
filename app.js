const path = require('path')
const express = require('express')
const morgan = require('morgan')

const cookieParser = require('cookie-parser')

const AppError = require('./src/utils/appError')
const globalErrorHandler = require('./src/controllers/errorController')
const newsRouter = require('./src/routes/newsRoutes')
const userRouter = require('./src/routes/userRoutes')
const reviewRouter = require('./src/routes/reviewRoutes')
const messagesRouter = require('./src/routes/messageRoutes')
const categoryRouter = require('./src/routes/categoryRoutes')
// const viewRouter = require('./routes/viewRoutes')
const cors = require('cors')

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// 1) Global MIDDLEWARES
app.use(cors())

app.use(
   cors({
      // origin: 'http://192.168.1.2:8080',
      origin: '*'
   })
)
// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Implement CORS

// Set security HTTP headers
// app.use(helmet());

// Development Logging

//console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'))
}

// Limit requests from the same IP

// const limiter = rateLimit({
//   max: 500,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again later in an hour!'
// })
// app.use('/api', limiter);

// Body pasrser, reading data from body in to req.body
app.use(
   express.json({
      //limit: '10kb'
   })
)

app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Data sanitization against NoSQL query injection
//app.use(mongoSanitize());

// Data sanitization against XSS
//app.use(xss());

// Prevent parameter pollution
//app.use(hpp({
//   whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price']
// }));

app.use(cookieParser())

// Test middleware
app.use((req, res, next) => {
   req.requestTime = new Date().toISOString()
   next()
})

// app.get('/', (req, res) => {
//    res.status(200).render('base')
// })

// app.use('/', viewRouter)
app.use('/api/v1/news', newsRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/comments', reviewRouter)
app.use('/api/v1/messages', messagesRouter)
app.use('/api/v1/categories', categoryRouter)

app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
