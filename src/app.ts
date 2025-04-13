import cookieParser from 'cookie-parser'
import express from 'express'
import logger from 'morgan'
import path from 'path'
import cors from 'cors'

import apiRoutes from './api/apiRoute.ts'
import { errorHandler, notFound } from './core/middlewares/errorHandlers.ts'
import initUploadFolder from './core/file/initUploadFolder.ts'
import { jsonify } from '~/core/middlewares/jsonify.ts'

const app = express()

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://localhost:3000',
      'http://192.168.46.100:3000',
      'https://192.168.46.100:3000'
    ], // Chỉ cho phép các domain được khai báo
    credentials: true // Cho phép trình duyệt gửi cookie đến server
  })
)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/images', express.static(path.resolve('uploads/images')))

// Init upload folder
initUploadFolder()

// add res.jsonify to response object
app.use(jsonify)

app.use('/api', apiRoutes)

// catch 404 and forward to error handler
app.use(notFound)

// error handler
app.use(errorHandler)

export default app
