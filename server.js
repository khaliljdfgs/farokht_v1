import express from 'express'
import expressAsyncErrors from 'express-async-errors'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config()

import { CreateAdmin } from './seed.js'
import ConnectMongoDB from './configs/database.js'
import Router from './routes/index.js'
import { NotFoundMiddleware, ErrorHandlerMiddleware } from './middlewares/index.js'

const app = express()
const PORT = process.env.PORT || 4000

const API_RATE_LIMITER = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests!'
})

if (process.env.ENVIRONMENT.toLowerCase() === 'dev')
  app.use(morgan('dev'))

app.use(express.json())
app.use(multer().array())

app.get('/', (request, response) => {
  response.send(`
    <style>body{ margin: 0; padding: 0; background-color: #fcfcfc }</style>
    <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh">
      <h1>Welcome To <span style="color:red">Farokht</span> API</h1>
    </div>
  `)
})

app.use('/api/v1/', API_RATE_LIMITER, Router)

app.use(NotFoundMiddleware)
app.use(ErrorHandlerMiddleware)

const StartServer = async () => {
  try {
    await ConnectMongoDB(process.env.MONGODB_URI)
    await CreateAdmin()
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
  } catch (error) { console.log(`Error: ${error}`) }
}

StartServer()