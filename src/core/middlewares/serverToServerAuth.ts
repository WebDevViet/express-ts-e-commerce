import { z } from 'zod'
import createError from '@/global/utils/createError'
import { validateHeaders } from '@/global/utils/validate'

export const serverToServerAuth = validateHeaders(
  z
    .object({
      'x-api-key': z
        .string()
        .optional()
        .refine((value) => {
          if (!value) {
            throw createError.Unauthorized('Authentication S2S failed.')
          }

          if (value !== process.env.API_KEY) {
            throw createError.Unauthorized('Authentication S2S failed. Check your auth and try again.')
          }
          return true
        })
    })
    .passthrough()
)
