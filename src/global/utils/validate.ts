import type { NextFunction, Request, Response } from 'express'
import { ZodError, type ParseParams, type ZodTypeAny } from 'zod'

type ReqPart = 'params' | 'query' | 'body' | 'headers' | 'cookies'

const validator =
  (reqPart: ReqPart) =>
  <T>(
    schemaToValidate: ZodTypeAny,
    funcMiddleware?: (arg: T, req: Request) => void | Promise<void>,
    parseParams?: Partial<ParseParams>
  ) =>
    async function (req: Request, _res: Response, next: NextFunction) {
      try {
        req[reqPart] = await schemaToValidate.parseAsync(req[reqPart], parseParams)

        if (funcMiddleware) await funcMiddleware(req[reqPart], req)

        next()
      } catch (error: unknown) {
        // catch logic error
        if (error instanceof ZodError && reqPart === 'body') {
          error.name = 'BodyError'
          next(error)
          return
        }

        // catch zod error, token error and other
        next(error)
      }
    }

export const validateBody = validator('body')

export const validateQuery = validator('query')

export const validateParams = validator('params')

export const validateHeaders = validator('headers')

export const validateCookies = validator('cookies')
