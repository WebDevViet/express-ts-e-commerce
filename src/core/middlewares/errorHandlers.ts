import { AUTH_MESSAGES } from '@/api/auth/constants/authMessage'
import type { JsonifyOptions } from '@/core/middlewares/jsonify'
import { TypeError } from '@/global/constants/enum/typeError'
import formatZodError from '@/global/helpers/formatZodError'
import createError from '@/global/utils/createError'
import type { NextFunction, Request, Response } from 'express'
import { isHttpError } from 'http-errors'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ZodError } from 'zod'

// * Constants

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(createError.NotFound({ name: 'NotFoundError', message: 'Not found' }))
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (isHttpError(err)) {
    return res.jsonify({
      status: err.status,
      message: err.message,
      typeError: err.name in TypeError ? (err.name as keyof typeof TypeError) : 'UnexpectedError'
    })
  }

  if (err instanceof ZodError) {
    const responseData: JsonifyOptions = {
      errors: formatZodError(err),
      message: 'Validation error',
      status: 'UNPROCESSABLE_ENTITY',
      typeError: err.name in TypeError ? (err.name as keyof typeof TypeError) : 'ValidationError'
    }

    if (!responseData.errors) return res.jsonify(responseData)

    const errorAuthorization = responseData.errors['Authorization']
    const errorRefreshToken = responseData.errors['refresh_token']

    if (errorAuthorization || errorRefreshToken) {
      responseData.status = 'UNAUTHORIZED'
      responseData.message = errorAuthorization || errorRefreshToken
      responseData.typeError = 'UnauthorizedError'
    }

    const requiredAccessToken = errorAuthorization?.includes('required')
    const requiredRefreshToken = errorRefreshToken?.includes('required')

    if (requiredAccessToken && !errorRefreshToken) {
      responseData.typeError = 'AccessTokenExpiredError'
    }

    if (requiredAccessToken && requiredRefreshToken) {
      if (req.cookies['logged_in'] === 'true') {
        responseData.message = AUTH_MESSAGES.LOGIN_SESSION_EXPIRED
        responseData.typeError = 'RefreshTokenExpiredError'
      } else {
        responseData.message = AUTH_MESSAGES.LOGIN_REQUIRED
      }
    }

    return res.jsonify(responseData)
  }

  if (err instanceof JsonWebTokenError) {
    const typeError = err.name in TypeError ? (err.name as keyof typeof TypeError) : 'UnexpectedTokenError'
    let message = err.message

    if (typeError === 'RefreshTokenExpiredError') message = AUTH_MESSAGES.LOGIN_SESSION_EXPIRED

    return res.jsonify({
      status: 'UNAUTHORIZED',
      message,
      typeError
    })
  }

  if (err instanceof Error) {
    return res.jsonify({
      status: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      typeError: 'InternalServerErrorError',
      errors: { ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) }
    })
  }

  res.jsonify({
    status: 'INTERNAL_SERVER_ERROR',
    message: 'System error',
    typeError: 'UnexpectedError'
  })
}
