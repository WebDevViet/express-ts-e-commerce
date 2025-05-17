import chalk from 'chalk'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import debug from 'debug'
import express from 'express'
import http from 'http'
import logger from 'morgan'
import os from 'os'
import path from 'path'

// * HTTPS
import https from 'https'
import fs from 'fs'

import mongoDB from '@/config/database/mongoDB'
import { applyMiddlewaresCustom } from '@/core/middlewares'

const app = express()

const originsCORS: string[] = JSON.parse(process.env.URL_CLIENTS || '["http://localhost:3000"]')

app.use(
  cors({
    origin: originsCORS,
    credentials: true
  })
)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/images', express.static(path.resolve('uploads/images')))

applyMiddlewaresCustom(app)

async function startServer() {
  const port = process.env.PORT || '4000'

  // app.set('port', port)

  await mongoDB.connect()

  const server = http.createServer(app)

  const isDevelopment = process.env.NODE_ENV === 'development'

  server.listen(port, () => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(chalk.yellowBright(`Server is running at http://localhost:${port}`))
    }
  })

  server.on('error', (error: any) => onError(error, port))
  server.on('listening', () => onListening(server))

  if (isDevelopment) {
    // * HTTPS
    const dirPath = './ssl' // thư mục hiện tại
    const files = fs.readdirSync(dirPath)

    const keyFile = files.find((file) => file.endsWith('-key.pem'))
    const certFile = files.find((file) => file.endsWith('.pem') && !file.endsWith('-key.pem'))

    if (!keyFile || !certFile) {
      // eslint-disable-next-line no-console
      console.error('Không tìm thấy file key hoặc cert')
      return
    }

    const key = fs.readFileSync(path.join(dirPath, keyFile))
    const cert = fs.readFileSync(path.join(dirPath, certFile))

    const server = https.createServer({ key, cert }, app)

    const portHttps = process.env.PORT_HTTPS || '4001'

    server.listen(portHttps, () => {
      // eslint-disable-next-line no-console
      console.log(chalk.yellowBright(`Server is running at https://${getLocalIP()}:${portHttps}`))
    })
    server.on('error', (error: any) => onError(error, portHttps))
    server.on('listening', () => onListening(server))
    return
  }
  // eslint-disable-next-line no-console
  console.log(chalk.yellowBright(`Server is running`))
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
const debuggerMongoose = debug('node-js-mongoose:server') // Import debugger Mongoose

function onListening(server: http.Server) {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`
  debuggerMongoose('Listening on ' + bind)
}

function getLocalIP() {
  const networkInterfaces = os.networkInterfaces()
  for (const name in networkInterfaces) {
    if (!networkInterfaces[name]) continue
    for (const net of networkInterfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return 'localhost'
}
