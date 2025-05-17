import jwt, { type SignOptions } from 'jsonwebtoken'
import type { TokenPayload } from '../types/JWT'
import formatJWTMessage from './formatJWTMessage'
import ms, { type StringValue } from 'ms'
import type { TokenType } from '@/global/constants/enum/enumUser'

export const signToken = ({
  payload,
  secretKey,
  options = {}
}: {
  payload: string | object | Buffer
  secretKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secretKey, options, (err, token) => {
      if (err) reject(err)
      resolve(token as string)
    })
  })
}

export const verifyToken = <T extends TokenPayload>({
  token,
  secretKey,
  label,
  typeToken
}: {
  token: string
  secretKey: string
  label: string
  typeToken: keyof typeof TokenType
}) => {
  return new Promise<T>((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) reject(formatJWTMessage(err, label, typeToken))

      resolve(decoded as T)
    })
  })
}

export const getRefreshTokenExpires = () =>
  new Date(Date.now() + 60000 + ms(process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue))

export const getAccessTokenExpires = () => new Date(Date.now() + ms(process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue))
