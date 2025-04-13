import { z } from 'zod'
import { BEARER_TOKEN_REGEX, JWT_REGEX } from '~/global/constants/regex'
import { verifyToken } from '~/global/helpers/handleJWT'
import { AUTH_MESSAGES } from '../constants/authMessage'

export default class TokenSchemaValidations {
  accessToken = z
    .string({ required_error: AUTH_MESSAGES.ACCESS_TOKEN_REQUIRED })
    .regex(BEARER_TOKEN_REGEX, { message: AUTH_MESSAGES.ACCESS_TOKEN_INVALID })
    .transform((value) => value.replace('Bearer ', ''))

  refreshToken = z
    .string({ required_error: AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED })
    .regex(JWT_REGEX, { message: AUTH_MESSAGES.REFRESH_TOKEN_INVALID })

  emailVerificationToken = z
    .string()
    .nonempty({ message: 'Giá trị không được để trống' })
    .regex(JWT_REGEX, { message: AUTH_MESSAGES.EMAIL_VERIFICATION_TOKEN_INVALID })
    .refine(async (token) => {
      await verifyToken({
        token,
        secretKey: process.env.EMAIL_VERIFICATION_TOKEN_SECRET_KEY,
        label: 'Email verification token',
        typeToken: 'EmailVerificationToken'
      })

      return true
    })

  forgotPasswordToken = z.string().regex(JWT_REGEX, { message: AUTH_MESSAGES.FORGOT_PASSWORD_TOKEN_INVALID })
}
