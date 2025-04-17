import createHttpError, { type HttpError } from 'http-errors'
import { HttpErrorStatus } from '@/global/constants/enum/httpErrorStatus'
import type { TypeError } from '@/global/constants/enum/typeError'

type CreateErrorOptions =
  | {
      /**
       * Message of error
       */
      message: string

      /**
       * Name of error
       */

      name?: `${TypeError}`
    }
  | string

const createError = Object.fromEntries(
  (Object.entries(HttpErrorStatus) as Array<[keyof typeof HttpErrorStatus, number]>).map(([key, value]) => [
    key,
    (options: CreateErrorOptions) => {
      return createHttpError(value, options)
    }
  ])
) as Record<keyof typeof HttpErrorStatus, (options: CreateErrorOptions) => HttpError<number>>

export default createError
