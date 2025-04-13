import axios from 'axios'
import bcrypt from 'bcrypt'
import type { Response } from 'express'
import generator from 'generate-password'
import createHttpError from 'http-errors'
import { ObjectId } from 'mongodb'
import mongoDB from '~/config/database/mongoDB'
import { AccountType, TokenType, UserVerifyStatus } from '~/global/constants/enum/enumUser'
import { getAccessTokenExpires, getRefreshTokenExpires, signToken } from '~/global/helpers/handleJWT'
import { USERS_MESSAGES } from '../users/constants/usersMessage'
import User from '../users/schemas/userSchema'
import usersServices from '../users/userService'
import { AUTH_MESSAGES } from './constants/authMessage'
import type { AuthSchemaTypes } from './schemas/authSchemaValidation'
import RefreshToken from './schemas/refreshTokenSchema'
import type { OAuthGoogleToken, OauthGoogleUserInfo } from './types/authReqRes'

class AuthServices {
  // private signEmailVerificationToken(userId: ObjectId) {
  //   return signToken({
  //     payload: {
  //       userId,
  //       tokenType: TokenType.EmailVerificationToken
  //     },
  //     secretKey: process.env.EMAIL_VERIFICATION_TOKEN_SECRET_KEY,
  //     options: { expiresIn: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN }
  //   })
  // }

  private signForgotPasswordToken(userId: ObjectId) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.ForgotPasswordToken
      },
      secretKey: process.env.FORGOT_PASSWORD_TOKEN_SECRET_KEY,
      options: { expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN }
    })
  }

  private signAccessToken({ userId }: { userId: ObjectId }) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.AccessToken
      },
      secretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    })
  }

  private signRefreshToken(userId: ObjectId) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.RefreshToken
      },
      secretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    })
  }

  private signAccessAndRefreshToken({ userId }: { userId: ObjectId }) {
    return Promise.all([this.signAccessToken({ userId }), this.signRefreshToken(userId)])
  }

  private async signAndStoreTokens({ userId }: { userId: ObjectId }) {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({ userId })
    await mongoDB.refreshTokens.insertOne(new RefreshToken({ userId, token: refreshToken }))
    return { accessToken, refreshToken }
  }

  private async getOauthGoogleToken(code: string): Promise<OAuthGoogleToken> {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }

    const { data } = await axios.post(process.env.GOOGLE_OAUTH_TOKEN_URL, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return data
  }

  private async getOauthGoogleUserInfo(access_token: string, id_token: string): Promise<OauthGoogleUserInfo> {
    const { data } = await axios.get(process.env.GOOGLE_OAUTH_USERINFO_URL, {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })

    return data
  }

  setAuthTokenToCookies(res: Response, data: { accessToken: string; refreshToken: string }) {
    // RFC 6265 - https://datatracker.ietf.org/doc/html/rfc6265 - cookie key naming format
    res.cookie('Authorization', `Bearer ${data.accessToken}`, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: getAccessTokenExpires()
      // secure: process.env.NODE_ENV === 'production',
    })

    res.cookie('refresh-token', data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: getRefreshTokenExpires()
      // secure: process.env.NODE_ENV === 'production',
    })
  }

  async register({ email, password }: AuthSchemaTypes['registerSchema']) {
    const user = await usersServices.getUserByEmail(email)
    if (user) throw createHttpError(409, { message: AUTH_MESSAGES.EMAIL_ALREADY_EXIST })
    const userId = new ObjectId()

    const [token] = await Promise.all([
      this.signAndStoreTokens({ userId }),
      mongoDB.users.insertOne(new User({ id: userId, email, password, accountType: AccountType.Email }))
    ])

    return token
  }

  async login({ email, password }: AuthSchemaTypes['loginSchema']) {
    const user = await mongoDB.users.findOne({ email })

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw createHttpError.Unauthorized(AUTH_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD)
    }

    const token = await this.signAndStoreTokens({ userId: user._id })
    return token
  }

  async logout(refreshToken: string) {
    await mongoDB.refreshTokens.deleteOne({ token: refreshToken })
  }

  async refreshToken(userId: ObjectId, refreshToken: string) {
    const [token] = await Promise.all([
      this.signAndStoreTokens({ userId }),
      mongoDB.refreshTokens.deleteOne({ token: refreshToken })
    ])

    return token
  }

  // async verifyEmail(userId: ObjectId) {
  //   const user = await usersServices.getUserById(userId)

  //   if (!user) {
  //     throw createHttpError.NotFound(USERS_MESSAGES.USER_NOT_FOUND)
  //   }

  //   if (user.verify === UserVerifyStatus.Verified) {
  //     throw createHttpError.Conflict(AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED)
  //   }

  //   const [token] = await Promise.all([
  //     this.signAndStoreTokens({ userId, userVerifyStatus: UserVerifyStatus.Verified }),
  //     mongoDB.users.updateOne(
  //       { _id: userId },
  //       {
  //         $set: {
  //           verify: UserVerifyStatus.Verified,
  //           email_verification_token: ''
  //         },
  //         $currentDate: { updated_at: true }
  //       }
  //     )
  //   ])

  //   return token
  // }

  // async resendVerificationEmail(userId: ObjectId) {
  //   const user = await usersServices.getUserById(userId)

  //   if (!user) {
  //     throw createHttpError.NotFound(USERS_MESSAGES.USER_NOT_FOUND)
  //   }

  //   if (user.verify === UserVerifyStatus.Verified) {
  //     throw createHttpError.Conflict(AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED)
  //   }

  //   const email_verification_token = await this.signEmailVerificationToken(userId)

  //   await mongoDB.users.updateOne(
  //     { _id: userId },
  //     {
  //       $set: { email_verification_token },
  //       $currentDate: { updated_at: true }
  //     }
  //   )

  //   // send email
  // }

  async forgotPassword(email: string) {
    const user = await usersServices.getUserByEmail(email)

    if (!user) {
      throw createHttpError.NotFound(USERS_MESSAGES.USER_NOT_FOUND)
    }

    const forgot_password_token = await this.signForgotPasswordToken(user._id)

    await mongoDB.users.updateOne(
      { _id: user._id },
      {
        $set: { forgot_password_token },
        $currentDate: { updated_at: true }
      }
    )

    // send email
  }

  async resetPassword(userId: ObjectId, password: string) {
    await mongoDB.users.updateOne(
      { _id: userId },
      {
        $set: {
          password: bcrypt.hashSync(password, 10),
          forgot_password_token: ''
        },
        $currentDate: { updated_at: true }
      }
    )
  }

  async changePassword(userId: ObjectId, { oldPassword, newPassword }: AuthSchemaTypes['changePasswordSchema']) {
    const user = await usersServices.getUserById(userId)

    if (!user) throw createHttpError.NotFound(USERS_MESSAGES.USER_NOT_FOUND)

    if (!bcrypt.compareSync(oldPassword, user.password))
      throw createHttpError.Unauthorized(USERS_MESSAGES.WRONG_PASSWORD)

    if (oldPassword === newPassword) throw createHttpError.BadRequest(USERS_MESSAGES.PASSWORD_NOT_CHANGED)

    await mongoDB.users.updateOne(
      { _id: userId },
      { $set: { password: bcrypt.hashSync(newPassword, 10) }, $currentDate: { updated_at: true } }
    )
  }

  async oauthGoogle(code: string) {
    const { access_token, id_token } = await this.getOauthGoogleToken(code)
    const { verified_email, email, name } = await this.getOauthGoogleUserInfo(access_token, id_token)

    if (!verified_email) {
      throw createHttpError.Unauthorized(AUTH_MESSAGES.OAUTH_GOOGLE_EMAIL_NOT_VERIFIED)
    }

    const user = await usersServices.getUserByEmail(email)

    if (user) {
      const token = await this.signAndStoreTokens({ userId: user._id })

      return {
        ...token,
        newUser: false
      }
    }

    const userId = new ObjectId()

    const [token] = await Promise.all([this.signAndStoreTokens({ userId })])

    await mongoDB.users.insertOne(
      new User({
        id: userId,
        name,
        email,
        password: generator.generate({
          length: 10,
          numbers: true,
          lowercase: true,
          uppercase: true,
          symbols: '!@#$%^&*'
        }),
        accountType: AccountType.Google
      })
    )

    // send email

    return {
      ...token,
      newUser: true,
      verifyEmail: UserVerifyStatus.Unverified
    }
  }
}

export default new AuthServices()
