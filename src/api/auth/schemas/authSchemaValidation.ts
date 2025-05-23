import { z } from 'zod'
import userZod from '@/api/users/schemas/userZod'
import TokenSchemaValidations from './tokenSchemaValidation'
import type { BaseSchemaType } from '@/global/helpers/types/typeRequest'
import { AUTH_MESSAGES } from '../constants/authMessage'
import createError from '@/global/utils/createError'

export default class AuthSchemaValidations extends TokenSchemaValidations {
  accessTokenSchema = z
    .object({
      refresh_token: this.refreshToken,
      Authorization: this.accessToken
    })
    .transform((value) => ({ ...value, refreshToken: value['refresh_token'] }))

  verifyEmailSchema = z.object({ emailVerificationToken: this.emailVerificationToken })

  registerSchema = userZod.pick({ email: true, password: true })

  loginSchema = userZod.pick({ email: true, password: true })

  logoutSchema = this.accessTokenSchema

  refreshTokenSchema = z
    .object({ refresh_token: this.refreshToken })
    .transform((value) => ({ ...value, refreshToken: value['refresh_token'] }))
    .refine(({ refreshToken }) => {
      if (!refreshToken)
        throw createError.Unauthorized({
          message: AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED,
          name: 'RefreshTokenExpiredError'
        })

      return true
    })

  serverKeySchema = z.object({ serverKey: z.string().optional() })

  forgotPasswordSchema = z.object({ email: userZod.shape.email })

  verifyForgotPasswordTokenSchema = z.object({ forgotPasswordToken: this.forgotPasswordToken })

  resetPasswordSchema = z
    .object({
      forgotPasswordToken: this.forgotPasswordToken,
      password: userZod.shape.password,
      confirmPassword: userZod.shape.confirmPassword
    })
    .refine(({ confirmPassword, password }) => confirmPassword === password, {
      message: AUTH_MESSAGES.PASSWORD_NOT_MATCH,
      path: ['confirmPassword']
    })

  changePasswordSchema = z
    .object({
      oldPassword: userZod.shape.password,
      newPassword: userZod.shape.password,
      confirmNewPassword: userZod.shape.confirmPassword
    })
    .refine(({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword, {
      message: AUTH_MESSAGES.PASSWORD_NOT_MATCH,
      path: ['confirmNewPassword']
    })
}

export type AuthSchemaTypes = BaseSchemaType<AuthSchemaValidations, TokenSchemaValidations>
