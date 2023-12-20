const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Test this & We have configured it was a success

process.on('uncaughtException', (err) => {
   console.log('UNHANDLED EXCEPTION! Shutting down...')
   console.log(err.name, err.message)
   process.exit(1)
})

dotenv.config({ path: './config.env' })
const app = require('./app')

mongoose
   // .connect(process.env.DATABASE_LOCAL, {
   .connect("mongodb+srv://filmonproxy:wvCj3JwHf98gkaLA@proxima-hope.a7es0of.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    useUnifiedTopology: true 
   })
   .then(() => console.log('DB connection successful!'))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
   console.log(`App running on port ${port}...`)
})

process.on('unhandledRejection', (err) => {
   console.log('UNHANDLED REJECTION! Shutting down...')
   console.log(err.name, err.message)
   server.close(() => {
      process.exit(1)
   })
})
