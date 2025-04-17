import { z } from 'zod'
import userZod from '@/api/users/schemas/userZod'
import TokenSchemaValidations from './tokenSchemaValidation'
import type { BaseSchemaType } from '@/global/helpers/types/typeRequest'
import { AUTH_MESSAGES } from '../constants/authMessage'

export default class AuthSchemaValidations extends TokenSchemaValidations {
  accessTokenSchema = z.object({ Authorization: this.accessToken })

  verifyEmailSchema = z.object({ emailVerificationToken: this.emailVerificationToken })

  registerSchema = userZod.pick({ email: true, password: true })

  loginSchema = userZod.pick({ email: true, password: true })

  logoutSchema = z
    .object({ 'refresh-token': this.refreshToken, Authorization: this.accessToken })
    .transform((value) => ({ ...value, refreshToken: value['refresh-token'] }))

  refreshTokenSchema = z
    .object({ 'refresh-token': this.refreshToken })
    .transform((value) => ({ ...value, refreshToken: value['refresh-token'] }))

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
