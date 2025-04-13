import chalk from 'chalk'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import debug from 'debug'
import express from 'express'
import logger from 'morgan'
import path from 'path'
import http from 'http'

// * SSL
// import https from 'https'
// import fs from 'fs'

import { jsonify } from '~/core/middlewares/jsonify'
import apiRoutes from '~/api/apiRoute'
import mongoDB from '~/config/database/mongoDB' // Import mongoDB
import { errorHandler, notFound } from './core/middlewares/errorHandlers'

const debuggerMongoose = debug('node-js-mongoose:server') // Import debug
const app = express()

const urlClients = JSON.parse(process.env.URL_CLIENTS || '["http://localhost:3000"]')

app.use(
  cors({
    origin: urlClients, // Chỉ cho phép các domain được khai báo
    credentials: true // Cho phép trình duyệt gửi cookie đến server
  })
)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/images', express.static(path.resolve('uploads/images')))

// add res.jsonify to response object
app.use(jsonify)

app.use('/api', apiRoutes)

// catch 404 and forward to error handler
app.use(notFound)

// error handler
app.use(errorHandler)

async function startServer() {
  const port = process.env.PORT || '4000'

  app.set('port', port)

  const server = http.createServer(
    // * SSL
    // const server = https.createServer(
    // {
    //   key: fs.readFileSync('./192.168.46.100-key.pem'),
    //   cert: fs.readFileSync('./192.168.46.100.pem')
    // },
    app
  )

  await mongoDB.connect()

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(chalk.yellowBright(`Server running on port: ${port}`))
  })
  server.on('error', (error: any) => onError(error, port))
  server.on('listening', () => onListening(server))
}

startServer()

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any, port: string) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = `Pipe ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(server: http.Server) {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`
  debuggerMongoose('Listening on ' + bind)
}
