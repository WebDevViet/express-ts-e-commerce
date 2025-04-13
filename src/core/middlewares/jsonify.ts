import type { NextFunction, Request, Response } from 'express'
import { TypeError } from '~/global/constants/enum/typeError'
import HttpStatus, { type KeysHttpStatus } from '~/global/constants/enum/httpStatus'

export interface JsonifyOptions {
  data?: any
  message: string
  status?: KeysHttpStatus | HttpStatus
  errors?: Record<string, string> | null
  typeError?: `${TypeError}` | null
}

export interface ResponsePayload<T = null> {
  data: T
  message: string
  errors: Record<string, string> | null
  typeError: TypeError | null
}

export const jsonify = (_req: Request, res: Response, next: NextFunction): void => {
  res.jsonify = ({ status, message, data = null, errors = null, typeError = null }: JsonifyOptions) => {
    const statusList = Object.values(HttpStatus) as Array<HttpStatus>

    status = typeof status === 'string' ? HttpStatus[status] : status
    status = typeof status === 'number' && statusList.includes(status) ? status : 200

    // eslint-disable-next-line no-console
    console.log({ status, data, message, errors, typeError })

    return res.status(status).json({ data, message, errors, typeError })
  }

  next()
}
