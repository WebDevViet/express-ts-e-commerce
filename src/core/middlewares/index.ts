/* eslint-disable no-console */
import chalk from 'chalk'
import { Application, NextFunction, Request, Response } from 'express'

import apiRoutes from '~/api/apiRoute'
import { errorHandler, notFound } from './errorHandlers'
import { jsonify } from './jsonify'
import { serverToServerAuth } from './serverToServerAuth'

const log = (req: Request, _res: Response, next: NextFunction) => {
  console.log(chalk.yellow('--------------------------------------------------------------------------'))
  console.log('🚀 ~ log ~ cookies:', req.cookies)
  console.log('🚀 ~ log ~ url:', req.url)
  next()
}

export const applyMiddlewaresCustom = (app: Application) => {
  app.use(log)

  // parse application/json
  app.use(jsonify)

  // x-api-key
  app.use(serverToServerAuth)

  app.use('/api', apiRoutes)

  // catch 404 and forward to error handler
  app.use(notFound)

  // error handler
  app.use(errorHandler)
}
