import type { Request } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
import type { UserId } from '~/global/types/common'
import type { AuthSchemaTypes } from '../schemas/authSchemaValidation'
import { RefreshTokenType } from '~/api/auth/schemas/refreshTokenSchema'

export type RegisterRequest = Request<ParamsDictionary, any, AuthSchemaTypes['registerSchema']>

export type LoginRequest = Request<ParamsDictionary, any, AuthSchemaTypes['loginSchema']>

export type LogoutRequest = { cookies: AuthSchemaTypes['logoutSchema'] }

export type RefreshTokenRequest = {
  refreshTokenRecord: Required<RefreshTokenType>
  cookies: AuthSchemaTypes['refreshTokenSchema']
} & UserId

export type VerifyEmailRequest = Request<ParamsDictionary, any, AuthSchemaTypes['verifyEmailSchema']> & UserId

export type ResendVerifyEmailRequest = UserId

export type ForgotPasswordRequest = Request<ParamsDictionary, any, AuthSchemaTypes['forgotPasswordSchema']>

export type ResetPasswordRequest = Request<ParamsDictionary, any, AuthSchemaTypes['resetPasswordSchema']> & UserId

export type ChangePasswordRequest = Request<ParamsDictionary, any, AuthSchemaTypes['changePasswordSchema']> & UserId

// OAuth Google
export interface OAuthGoogleQuery {
  code: string
}

export interface OauthGoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
}

export interface OAuthGoogleToken {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
  id_token: string
}

export type OAuthGoogleRequest = Request<ParamsDictionary, any, any, OAuthGoogleQuery>
