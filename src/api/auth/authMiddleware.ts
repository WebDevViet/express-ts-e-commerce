// import type { Request } from 'express'
// import createHttpError from 'http-errors'
import { ObjectId } from 'mongodb'
// import { UserVerifyStatus } from '~/global/constants/enum/enumUser'
import { verifyToken } from '~/global/helpers/handleJWT'
import type { AccessTokenPayload } from '~/global/types/JWT'
import { validateBody, validateCookies } from '~/global/utils/validate'
// import usersServices from '../users/userService'
import { AUTH_MESSAGES } from './constants/authMessage'
import AuthSchemaValidations, { type AuthSchemaTypes } from './schemas/authSchemaValidation'
// import { USERS_MESSAGES } from '../users/constants/usersMessage'
import mongoDB from '~/config/database/mongoDB'
import createError from '~/global/utils/createError'

class AuthMiddlewares extends AuthSchemaValidations {
  access = validateCookies<AuthSchemaTypes['accessTokenSchema']>(
    this.accessTokenSchema,
    async ({ Authorization: token }, req) => {
      const { userId } = await verifyToken<AccessTokenPayload>({
        token,
        secretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
        label: 'Access token',
        typeToken: 'AccessToken'
      })

      req.userId = new ObjectId(userId)
    }
  )

  // verifiedUser = validateHeaders<AuthSchemaTypes['accessTokenSchema']>(
  //   this.accessTokenSchema,
  //   async ({ authorization: token }, req) => {
  //     const { userId, userVerifyStatus } = await verifyToken<AccessTokenPayload>({
  //       token,
  //       secretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
  //       label: 'Access token'
  //     })

  //     if (userVerifyStatus !== UserVerifyStatus.Verified) {
  //       throw createHttpError.Unauthorized(AUTH_MESSAGES.USER_NOT_VERIFIED)
  //     }

  //     req.userId = new ObjectId(userId)
  //   }
  // )

  register = validateBody(this.registerSchema)

  login = validateBody(this.loginSchema)

  logout = validateCookies(
    this.logoutSchema.refine(async ({ Authorization: accessToken, 'refresh-token': refreshToken }) => {
      const [refreshTokenRecord] = await Promise.all([
        mongoDB.refreshTokens.findOne({ token: refreshToken }),
        verifyToken({
          token: accessToken,
          secretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
          label: 'Access token',
          typeToken: 'AccessToken'
        }),
        verifyToken({
          token: refreshToken,
          secretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
          label: 'Refresh token',
          typeToken: 'RefreshToken'
        })
      ])

      if (!refreshTokenRecord) {
        throw createError.Unauthorized({
          message: AUTH_MESSAGES.REFRESH_TOKEN_EXPIRES,
          name: 'RefreshTokenExpiredError'
        })
      }

      return true
    })
  )

  refresh = validateCookies<AuthSchemaTypes['refreshTokenSchema']>(
    this.refreshTokenSchema,
    async ({ 'refresh-token': refreshToken }, req) => {
      const [refreshTokenRecord, { userId }] = await Promise.all([
        mongoDB.refreshTokens.findOne({ token: refreshToken }),
        verifyToken({
          token: refreshToken,
          secretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
          label: 'Refresh token',
          typeToken: 'RefreshToken'
        })
      ])

      if (!refreshTokenRecord) {
        throw createError.Unauthorized({
          message: AUTH_MESSAGES.REFRESH_TOKEN_EXPIRES,
          name: 'RefreshTokenExpiredError'
        })
      }

      req.userId = new ObjectId(userId)
    }
  )

  // verifyEmail = validateBody(this.verifyEmailSchema)

  // forgotPassword = validateBody(this.forgotPasswordSchema)

  // forgotPasswordTokenMiddleware = async (
  //   { forgotPasswordToken: token }: { forgotPasswordToken: string },
  //   req: Request
  // ) => {
  //   const { userId } = await verifyToken({
  //     token,
  //     secretKey: process.env.FORGOT_PASSWORD_TOKEN_SECRET_KEY,
  //     label: 'Forgot password token'
  //   })

  //   const user = await usersServices.getUserById(userId)
  //   if (!user) {
  //     throw createHttpError.NotFound(USERS_MESSAGES.USER_NOT_FOUND)
  //   }

  //   if (user.forgot_password_token !== token) {
  //     throw createHttpError.Unauthorized(AUTH_MESSAGES.FORGOT_PASSWORD_TOKEN_INVALID)
  //   }

  //   req.userId = new ObjectId(userId)
  // }

  // verifyForgotPasswordToken = validateBody(this.verifyForgotPasswordTokenSchema, this.forgotPasswordTokenMiddleware)

  // resetPassword = validateBody(this.resetPasswordSchema, this.forgotPasswordTokenMiddleware)

  // changePassword = validateBody(this.changePasswordSchema)
}

export default new AuthMiddlewares()
